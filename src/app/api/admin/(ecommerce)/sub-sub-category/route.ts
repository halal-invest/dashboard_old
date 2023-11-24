import { checkPermission } from '@/utils/checkPermissions';
import prisma from '@/utils/connect';
import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';

interface SubSubCategory {
    id: number;
    title: string;
    slug: string;
    media?: { id: number; title: string; url: string; sizeProductId: number | null; categoryId: number | null; subCategoryId: number | null; subSubCategoryId: number | null; createdAt: Date; updatedAt: Date } | null | undefined;
    imageUrl?: string;
    subCategoryId: number;
}


export const GET = async (request: NextRequest) => {
    const requiredPermission = 'categories';

    if (await checkPermission(request, requiredPermission)) {
        try {
            const categories: SubSubCategory[] = await prisma.subSubCategory.findMany({include:{media:true}});
            return NextResponse.json(categories);
        } catch (error) {
            return NextResponse.json({
                status: false,
                error,
                message: 'Something went wrong !'
            });
        }
    } else {
        return NextResponse.json(null, { status: 200 });
    }
};

export const POST = async (request: NextRequest) => {
    let { title, slug, imageUrl, subCategoryId }: SubSubCategory = await request.json();
    const requiredPermission = 'categories';

    if (await checkPermission(request, requiredPermission)) {
        try {
            const exist: SubSubCategory | null = await prisma.subSubCategory.findFirst({
                where: { title }
            });

            if (exist) {
                return NextResponse.json({
                    status: false,
                    message: `${title} already exist. Try again!`
                });
            } else {
                if (slug === null || slug === '') {
                    slug = slugify(title);
                }
               const newSubSubCategory = await prisma.subSubCategory.create({
                    data: {
                        title,
                        slug: slug,
                        subCategoryId
                    }
                });
                if (imageUrl != null) {
                    await prisma.media.create({
                        data: {
                            title: newSubSubCategory?.title,
                            url: imageUrl,
                            subSubCategory: {
                                connect: { id: newSubSubCategory?.id }
                            }
                        }
                    });
                }


                return NextResponse.json({
                    status: true,
                    message: `Category ${title} has been created successfully`
                });
            }
        } catch (error) {
            return NextResponse.json({
                status: false,
                error,
                message: 'Something went wrong !'
            });
        }
    } else {
        return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });
    }
};

export const PATCH = async (request: NextRequest) => {
    let { id, title, slug, imageUrl, subCategoryId }: SubSubCategory = await request.json();
    if (slug === null || slug === '') {
        slug = slugify(title);
    }
    const requiredPermission = 'categories';

    if (await checkPermission(request, requiredPermission)) {
        try {
            const subSubCategory = await prisma.subSubCategory.findFirst({ include: { media: true } });
            if (imageUrl != null) {
                if (subSubCategory?.media === null) {
                    await prisma.media.create({
                        data: {
                            title: subSubCategory?.title,
                            url: imageUrl,
                            subSubCategory: {
                                connect: { id: subSubCategory?.id }
                            }
                        }
                    });
                }
                await prisma.media.update({
                    where: {
                        id: subSubCategory?.media?.id
                    },
                    data: {
                        url: imageUrl
                    }
                });
            }
            await prisma.subSubCategory.update({
                where: {
                    id
                },
                data: {
                    title,
                    slug: slug,
                    subCategoryId
                }
            });

            return NextResponse.json({
                message: `SubSubCategory ${title} has been update successfully`,
                status: true
            });
        } catch (error: any) {
            if (error.code == 'P2002') {
                return NextResponse.json({
                    message: 'Same title already exist. Try again',
                    status: false
                });
            }
            return NextResponse.json({
                message: 'Something went wrong',
                status: true
            });
        }
    } else {
        return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });
    }
};

export const DELETE = async (request: NextRequest) => {
    const { id }: { id: number[] } = await request.json();
    const requiredPermission = 'categories';

    if (await checkPermission(request, requiredPermission)) {
        try {
            if (id.length > 1) {
                await prisma.subSubCategory.deleteMany({
                    where: {
                        id: {
                            in: id
                        }
                    }
                });
                return NextResponse.json({
                    message: 'Categories Delete has been successfully',
                    status: true
                });
            } else {
                await prisma.subSubCategory.delete({
                    where: {
                        id: id[0]
                    }
                });
                return NextResponse.json({
                    message: 'Category Delete has been successfully',
                    status: true
                });
            }
        } catch (error: any) {
            if (error.code === 'P2003') {
                return NextResponse.json({
                    message: "Child value has existed, don't delete this category",
                    status: false
                });
            } else {
                return NextResponse.json({
                    message: 'Something went wrong',
                    error,
                    status: false
                });
            }
        }
    } else {
        return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });
    }
};

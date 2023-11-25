import { checkPermission } from '@/utils/checkPermissions';
import prisma from '@/utils/connect';
import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';

interface SubCategory {
    id: number;
    title: string;
    slug: string;
    media?: { id: number; title: string; url: string; sizeProductId: number | null; categoryId: number | null; subCategoryId: number | null; subSubCategoryId: number | null; createdAt: Date; updatedAt: Date } | null | undefined;
    imageUrl?: string;
    categoryId: number;
}

export const GET = async (request: NextRequest) => {
    const requiredPermission = 'categories';

    if (await checkPermission(request, requiredPermission)) {
        try {
            const subCategories: SubCategory[] = await prisma.subCategory.findMany({
                include: { media: true }
            });
            return NextResponse.json(subCategories);
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
    let { title, slug, imageUrl, categoryId }: SubCategory = await request.json();
    const requiredPermission = 'categories';

    // if (await checkPermission(request, requiredPermission)) {
        try {
            const exist: SubCategory | null = await prisma.subCategory.findFirst({
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
                const newSubCategory = await prisma.subCategory.create({
                    data: {
                        title,
                        slug: slug,
                        categoryId
                    }
                });
                if (imageUrl != null) {
                    await prisma.media.create({
                        data: {
                            title: newSubCategory?.title,
                            url: imageUrl,
                            subCategory: {
                                connect: { id: newSubCategory?.id }
                            }
                        }
                    });
                }

                return NextResponse.json({
                    status: true,
                    message: `SubCategory ${title} has been created successfully`
                });
            }
        } catch (error) {
            return NextResponse.json({
                status: false,
                error,
                message: 'Something went wrong !'
            });
        }
    // } else {
    //     return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });
    // }
};

export const PATCH = async (request: NextRequest) => {
    let { id, title, slug, imageUrl, categoryId }: SubCategory = await request.json();
    if (slug === null || slug === '') {
        slug = slugify(title);
    }
    const requiredPermission = 'categories';

    if (await checkPermission(request, requiredPermission)) {
        try {
            const subCategory = await prisma.subCategory.findFirst({ include: { media: true } });
            if (imageUrl != null) {
                if (subCategory?.media === null) {
                    await prisma.media.create({
                        data: {
                            title: subCategory?.title,
                            url: imageUrl,
                            subCategory: {
                                connect: { id: subCategory?.id }
                            }
                        }
                    });
                }
                await prisma.media.update({
                    where: {
                        id: subCategory?.media?.id
                    },
                    data: {
                        url: imageUrl
                    }
                });
            }
            await prisma.subCategory.update({
                where: {
                    id
                },
                data: {
                    title,
                    slug: slug,
                    categoryId: categoryId
                }
            });

            return NextResponse.json({
                message: `SubCategory ${title} has been update successfully`,
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
                await prisma.subCategory.deleteMany({
                    where: {
                        id: {
                            in: id
                        }
                    }
                });
                return NextResponse.json({
                    message: 'SubCategories Delete has been successfully',
                    status: true
                });
            } else {
                await prisma.subCategory.delete({
                    where: {
                        id: id[0]
                    }
                });
                return NextResponse.json({
                    message: 'SubCategory Delete has been successfully',
                    status: true
                });
            }
        } catch (error: any) {
            if (error.code === 'P2003') {
                return NextResponse.json({
                    message: "Child value has existed, don't delete this subCategory",
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

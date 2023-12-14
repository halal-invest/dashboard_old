import { checkPermission } from '@/utils/checkPermissions';
import prisma from '@/utils/connect';
import { connect } from 'http2';
import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';

interface Category {
    id: number;
    title: string;
    slug: string;
    media?: { id: number; title: string; url: string; sizeProductId: number | null; categoryId: number | null; subCategoryId: number | null; subSubCategoryId: number | null; createdAt: Date; updatedAt: Date } | null | undefined;
    imageUrl: string;
}

export const GET = async (request: NextRequest) => {
    const requiredPermission = 'categories';

    // if (await checkPermission(request, requiredPermission)) {
    try {
        const categories = await prisma.category.findMany({
            include: {
                media: true,
                subcategory: {
                    include: {
                        subSubCategory: {
                            include: {
                                media: true,
                            }
                        },
                        media: true,
                    }
                }
            }
        });
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({
            status: false,
            error,
            message: 'Something went wrong !'
        });
    }
    // } else {
    //     return NextResponse.json(null, { status: 200 });
    // }
};

export const POST = async (request: NextRequest) => {
    let { title, slug, imageUrl }: Category = await request.json();
    const requiredPermission = 'categories';


    // if (await checkPermission(request, requiredPermission)) {
    try {

        const exist = await prisma.category.findFirst({
            where: { title }
        });

        if (exist) {
            return NextResponse.json({
                status: false,
                message: `${title} already exist. Try again!`
            });
        } else {
            if (slug === null || slug.trim() === '') {
                slug = slugify(title);
            }
            const newCategory = await prisma.category.create({
                data: {
                    title,
                    slug: slug
                }
            });
            if (imageUrl?.trim() !== "") {
                await prisma.media.create({
                    data: {
                        title: newCategory?.title,
                        url: imageUrl,
                        category: {
                            connect: { id: newCategory?.id }
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
    // } else {
    //     return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });
    // }
};

export const PATCH = async (request: NextRequest) => {
    let { id, title, slug, imageUrl }: Category = await request.json();

    const requiredPermission = 'categories';

    // if (await checkPermission(request, requiredPermission)) {
    try {
        const category = await prisma.category.findFirst({
            where: { id },
            include: {
                media: true
            }
        });

    
        if (category?.media && imageUrl?.trim() === "") {
            await prisma.media.delete({
                where: {
                    categoryId: category.id,
                }
            })
        }
        if (imageUrl?.trim() !== "") {
            if (category?.media === null) {
                await prisma.media.create({
                    data: {
                        title: category?.title,
                        url: imageUrl,
                        category: {
                            connect: { id: category?.id }
                        }
                    }
                });
            }
            else {
                await prisma.media.update({
                    where: {
                        id: category?.media?.id
                    },
                    data: {
                        url: imageUrl
                    }
                });
            }

        }


        if (slug === null || slug.trim() === '') {
            slug = slugify(title);
        }
        await prisma.category.update({
            where: {
                id
            },
            data: {
                title,
                slug: slug
            },
        });

        return NextResponse.json({
            message: `Category ${title} has been update successfully`,
            status: true
        });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({
            message: 'Something went wrong',
            status: true
        });
    }
    // } else {
    //     return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });
    // }
};

export const DELETE = async (request: NextRequest) => {
    const { id }: { id: number[] } = await request.json();
    const requiredPermission = 'categories';

    if (await checkPermission(request, requiredPermission)) {
        try {


            await prisma.media.deleteMany({
                where: {
                    categoryId: {
                        in: id,
                    }
                }
            });


            if (id.length > 1) {
                await prisma.category.deleteMany({
                    where: {
                        id: {
                            in: id
                        }
                    }
                });
                //should delete media for these categories
                return NextResponse.json({
                    message: 'Categories Delete has been successfully',
                    status: true
                });
            } else {
                await prisma.category.delete({
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

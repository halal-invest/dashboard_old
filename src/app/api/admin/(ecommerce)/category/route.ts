import { checkPermission } from '@/utils/checkPermissions';
import prisma from '@/utils/connect';
import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';

interface ICategory extends IRequest {
    id: number;
    slug: string;
}

interface IUpdate extends IRequest {
    id: number;
}

interface IRequest {
    title: string;
    image: string;
    slug: string;
}

export const GET = async (request: NextRequest) => {
    const requiredPermission = 'categories';

    if (await checkPermission(request, requiredPermission)) {
        try {
            const categories: ICategory[] = await prisma.category.findMany();
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
    let { title, slug, image }: IRequest = await request.json();
    const requiredPermission = 'categories';

    if (await checkPermission(request, requiredPermission)) {
        try {
            const exist: ICategory | null = await prisma.category.findFirst({
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
                await prisma.category.create({
                    data: {
                        title,
                        slug: slug,
                        image
                    }
                });

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
    let { id, title, slug, image }: IUpdate = await request.json();
    if (slug === null || slug === '') {
        slug = slugify(title);
    }
    const requiredPermission = 'categories';

    if (await checkPermission(request, requiredPermission)) {
        try {
            await prisma.category.update({
                where: {
                    id
                },
                data: {
                    title,
                    slug: slug,
                    image
                }
            });

            return NextResponse.json({
                message: `Category ${title} has been update successfully`,
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
                await prisma.category.deleteMany({
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

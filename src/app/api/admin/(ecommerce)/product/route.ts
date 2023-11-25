import { checkPermission } from '@/utils/checkPermissions';
import prisma from '@/utils/connect';
import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';

interface Product {
    id: number;
    title: string;
    slug: string;
    sku?: string | null;
    season?: string | null;
    subCategoryId?: number | null;
    subSubCategoryId?: number | null;
}

export const GET = async (request: NextRequest) => {
    const requiredPermission = 'products';

    if (await checkPermission(request, requiredPermission)) {
        try {
            const products: Product[] = await prisma.product.findMany();
            return NextResponse.json(products);
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
    let { title, slug, sku, season,subCategoryId, subSubCategoryId }: Product = await request.json();
    const requiredPermission = 'products';

    // if (await checkPermission(request, requiredPermission)) {
        try {
            const exist: Product | null = await prisma.product.findFirst({
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
                await prisma.product.create({
                    data: {
                        title,
                        slug,
                        sku,
                        season,
                        subCategoryId,
                        subSubCategoryId
                    }
                });

                return NextResponse.json({
                    status: true,
                    message: `Product ${title} has been created successfully`
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
    let { id, title, slug, sku, season, subCategoryId, subSubCategoryId }: Product = await request.json();
    const requiredPermission = 'products';

    if (await checkPermission(request, requiredPermission)) {
        try {
            await prisma.product.update({
                where: {
                    id
                },
                data: {
                    title,
                    slug,
                    sku,
                    season,
                    subCategoryId,
                    subSubCategoryId
                }
            });

            return NextResponse.json({
                message: `Product ${title} has been update successfully`,
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
    const requiredPermission = 'products';

    if (await checkPermission(request, requiredPermission)) {
        try {
            if (id.length > 1) {
                await prisma.product.deleteMany({
                    where: {
                        id: {
                            in: id
                        }
                    }
                });
                return NextResponse.json({
                    message: 'products Delete has been successfully',
                    status: true
                });
            } else {
                await prisma.product.delete({
                    where: {
                        id: id[0]
                    }
                });
                return NextResponse.json({
                    message: 'Product Delete has been successfully',
                    status: true
                });
            }
        } catch (error: any) {
            if (error.code === 'P2003') {
                return NextResponse.json({
                    message: "Child value has existed, don't delete this product",
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

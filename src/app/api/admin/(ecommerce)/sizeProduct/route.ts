import { checkPermission } from '@/utils/checkPermissions';
import prisma from '@/utils/connect';
import { connect } from 'http2';
import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';



interface PostSizeProduct {
    id: number;
    productId: number;
    sizeId: number;
    stock?: number | null;
    price: number;
    originalPrice: number;
    shortDescription: string;
    description?: string | null;
    bestDeal?: boolean | undefined;
    discountedSale?: boolean;
    colors?: { id: number; title: string; colorCode: string };
    media?: { id: number; title: string; url: string; sizeProductId: number | null; categoryId: number | null; subCategoryId: number | null; subSubCategoryId: number | null; createdAt: Date; updatedAt: Date } | null | undefined;
    imageUrl?: string[];
    colorCode: number[];
}

export const GET = async (request: NextRequest) => {
    const requiredPermission = 'size-products';

    // if (await checkPermission(request, requiredPermission)) {
    try {
        const sizeProducts = await prisma.sizeProduct.findMany({
            include: {
                images: true,
                colors: true,
                product:true,
                size: true
            }
        });
        return NextResponse.json(sizeProducts);
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
    let { productId, sizeId, stock, price, originalPrice, imageUrl, shortDescription, description, bestDeal, discountedSale, colorCode }: PostSizeProduct = await request.json();
    const requiredPermission = 'size-products';

    let colors;
    if (colorCode.length > 0) {
        colors = colorCode;
    } else {
        colors = [1];
    }
    // if (await checkPermission(request, requiredPermission)) {
    try {
        const newSizeProduct = await prisma.sizeProduct.create({
            data: {
                product: {
                    connect: { id: productId }
                },
                size: {
                    connect: { id: sizeId }
                },
                stock,
                price,
                originalPrice,
                shortDescription,
                description,
                bestDeal,
                discountedSale,
                colors: {
                    connect: colors.map((id: any) => ({ id }))
                }
            },
            include: {
                product: true
            }
        });

      

        if (imageUrl != null) {
            for(let i = 0; i < imageUrl.length ;i ++){
                await prisma.media.create({
                    data: {
                        title: newSizeProduct?.product?.title ,
                        url: imageUrl[i],
                        sizeProduct: {
                            connect: { id: newSizeProduct?.id }
                        }
                    }
                });
            }
            
        }

        return NextResponse.json({
            status: true,
            message: `Product Variant has been created successfully`
        });
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
    let { id, stock, price, originalPrice, imageUrl, shortDescription, description, bestDeal, discountedSale, colorCode }: PostSizeProduct = await request.json();


    const requiredPermission = 'size-products';

    // if (await checkPermission(request, requiredPermission)) {
    try {
        const sizeProduct = await prisma.sizeProduct.findFirst({
            where: { id },
            include: {
                images: true,
                colors:true,
                size: true,
                product:true
            }
        });
        if (imageUrl != null) {
            if (sizeProduct?.images === null) {

                for(let i = 0; i < imageUrl.length ;i ++){
                await prisma.media.create({
                    data: {
                        title: sizeProduct?.product?.title ,
                        url: imageUrl[i],
                        sizeProduct: {
                            connect: { id: sizeProduct?.id }
                        }
                    }
                });
            }
            }

            //need to the media update method
        }

        let colors;
        if (colorCode.length > 0) {
            colors = colorCode;
        } else {
            colors = [1];
        }
        await prisma.sizeProduct.update({
            where: {
                id
            },
            data: {
                stock,
                price,
                originalPrice,
                shortDescription,
                description,
                bestDeal,
                discountedSale,
                colors: {
                    disconnect: sizeProduct?.colors,
                    connect: colors.map((id: any) => ({ id }))
                }
            },
        });

        return NextResponse.json({
            message: `Product Variant has been update successfully`,
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
    // } else {
    //     return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });
    // }
};

export const DELETE = async (request: NextRequest) => {
    const { id }: { id: number[] } = await request.json();
    const requiredPermission = 'size-products';

    if (await checkPermission(request, requiredPermission)) {
        try {
            if (id.length > 1) {
                await prisma.sizeProduct.deleteMany({
                    where: {
                        id: {
                            in: id
                        }
                    }
                });
                //should delete media for these size-products
                return NextResponse.json({
                    message: 'Categories Delete has been successfully',
                    status: true
                });
            } else {
                await prisma.sizeProduct.delete({
                    where: {
                        id: id[0]
                    }
                });
                return NextResponse.json({
                    message: 'SizeProduct Delete has been successfully',
                    status: true
                });
            }
        } catch (error: any) {
            if (error.code === 'P2003') {
                return NextResponse.json({
                    message: "Child value has existed, don't delete this sizeProduct",
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

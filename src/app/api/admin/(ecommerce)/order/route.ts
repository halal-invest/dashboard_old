import { checkPermission } from '@/utils/checkPermissions';
import prisma from '@/utils/connect';
import { connect } from 'http2';
import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';

interface Order {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country?: string | null;
    postal_code: string;
    profile: {
        id: number;
        userId: number;
        optUserId: number;
        name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        country: string;
        postal_code: string;
    };
    sizeProducts: {
        id: number;
        price: number;
        quantity: number;
    }[];
    profileId: number;
    subTotal: string;
    total: string;
    paymentMethodsId: number;
    paymentMethods: any;
    transactionPhoneNo: string;
    transactionNo: string;
    deliveryCostId: number;
    deliveryCost: any;
    paymentStatus: string;
    orderStatus: string;
}

export const GET = async (request: NextRequest) => {
    const requiredPermission = 'orders';

    // if (await checkPermission(request, requiredPermission)) {
    try {
        const orders = await prisma.order.findMany({
            include: {
                profile: true,
                paymentMethods: true,
                deliveryCost: true,
                productOrder: true
            }
        });
        return NextResponse.json(orders);
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
    let { name, email, phone, address, city, country, postal_code, sizeProducts, profileId, subTotal, total, paymentMethodsId, transactionPhoneNo, transactionNo, deliveryCostId, paymentStatus, orderStatus }: Order = await request.json();
    const requiredPermission = 'orders';

    // if (await checkPermission(request, requiredPermission)) {
    try {
        const newOrder = await prisma.order.create({
            data: {
                name,
                email,
                phone,
                address,
                city,
                country,
                postal_code,
                subTotal,
                total,
                transactionNo,
                transactionPhoneNo,
                paymentStatus,
                orderStatus,
                profile: {
                    connect: { id: profileId }
                },
                deliveryCost: { connect: { id: deliveryCostId } },
                paymentMethods: { connect: { id: paymentMethodsId } }
            }
        });

        for (let i = 0; i < sizeProducts.length; i++) {
            const productOrders = await prisma.productOrder.create({
                data: {
                    order: {
                        connect: { id: newOrder.id }
                    },
                    sizeProduct: {
                        connect: { id: sizeProducts[i].id }
                    },
                    price: sizeProducts[i].price,
                    quantity: sizeProducts[i].quantity
                }
            });
        }

        return NextResponse.json({
            status: true,
            message: `Order has been created successfully`
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
    let { id, name, email, phone, address, city, country, postal_code, sizeProducts, profileId, subTotal, total, paymentMethodsId, transactionPhoneNo, transactionNo, deliveryCostId, paymentStatus, orderStatus }: Order = await request.json();

    const requiredPermission = 'orders';

    // if (await checkPermission(request, requiredPermission)) {
    try {
        const existOrder = await prisma.order.findFirst({
            where: { id }
        });

        const updateOrder = await prisma.order.update({
            where: { id: id },
            data: {}
        });

        await prisma.order.update({
            where: {
                id
            },
            data: {
                title,
                slug: slug
            }
        });

        return NextResponse.json({
            message: `Order ${title} has been update successfully`,
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
    const requiredPermission = 'orders';

    if (await checkPermission(request, requiredPermission)) {
        try {
            if (id.length > 1) {
                await prisma.order.deleteMany({
                    where: {
                        id: {
                            in: id
                        }
                    }
                });
                //should delete media for these orders
                return NextResponse.json({
                    message: 'Categories Delete has been successfully',
                    status: true
                });
            } else {
                await prisma.order.delete({
                    where: {
                        id: id[0]
                    }
                });
                return NextResponse.json({
                    message: 'Order Delete has been successfully',
                    status: true
                });
            }
        } catch (error: any) {
            if (error.code === 'P2003') {
                return NextResponse.json({
                    message: "Child value has existed, don't delete this order",
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

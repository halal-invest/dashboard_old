import { checkPermission } from '@/utils/checkPermissions';
import prisma from '@/utils/connect';
import { NextRequest, NextResponse } from 'next/server';

interface PaymentMethod {
    id: number;
    title: string;
    description: string;
}

export const GET = async (request: NextRequest) => {
    const requiredPermission = 'payment-methods';

    if (await checkPermission(request, requiredPermission)) {
        try {
            const paymentmethods: PaymentMethod[] = await prisma.paymentMethod.findMany();
            return NextResponse.json(paymentmethods);
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
    let { title, description }: PaymentMethod = await request.json();
    const requiredPermission = 'payment-methods';

    if (await checkPermission(request, requiredPermission)) {
        try {
            const exist: PaymentMethod | null = await prisma.paymentMethod.findFirst({
                where: { title }
            });

            if (exist) {
                return NextResponse.json({
                    status: false,
                    message: `${title} already exist. Try again!`
                });
            } else {
                await prisma.paymentMethod.create({
                    data: {
                        title,
                        description
                    }
                });

                return NextResponse.json({
                    status: true,
                    message: `PaymentMethod ${title} has been created successfully`
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
    let { id, title, description }: PaymentMethod = await request.json();
    const requiredPermission = 'payment-methods';

    if (await checkPermission(request, requiredPermission)) {
        try {
            await prisma.paymentMethod.update({
                where: {
                    id
                },
                data: {
                    title,
                    description
                }
            });

            return NextResponse.json({
                message: `PaymentMethod ${title} has been update successfully`,
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
    const requiredPermission = 'payment-methods';

    if (await checkPermission(request, requiredPermission)) {
        try {
            if (id.length > 1) {
                await prisma.paymentMethod.deleteMany({
                    where: {
                        id: {
                            in: id
                        }
                    }
                });
                return NextResponse.json({
                    message: 'payment-methods Delete has been successfully',
                    status: true
                });
            } else {
                await prisma.paymentMethod.delete({
                    where: {
                        id: id[0]
                    }
                });
                return NextResponse.json({
                    message: 'PaymentMethod Delete has been successfully',
                    status: true
                });
            }
        } catch (error: any) {
            if (error.code === 'P2003') {
                return NextResponse.json({
                    message: "Child value has existed, don't delete this paymentMethod",
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

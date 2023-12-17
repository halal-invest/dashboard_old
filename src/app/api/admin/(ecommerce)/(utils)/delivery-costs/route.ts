import { checkPermission } from '@/utils/checkPermissions';
import prisma from '@/utils/connect';
import { NextRequest, NextResponse } from 'next/server';

interface DeliveryCost {
    id: number;
    areaName: string;
    cost:string;
}

export const GET = async (request: NextRequest) => {
    const requiredPermission = 'delivery-costs';

    // if (await checkPermission(request, requiredPermission)) {
        try {
            const deliverycosts: DeliveryCost[] = await prisma.deliveryCost.findMany();
            return NextResponse.json(deliverycosts);
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
    let { areaName, cost }: DeliveryCost = await request.json();
    const requiredPermission = 'delivery-costs';

    // if (await checkPermission(request, requiredPermission)) {
        try {
            const exist: DeliveryCost | null = await prisma.deliveryCost.findFirst({
                where: { areaName }
            });

            if (exist) {
                return NextResponse.json({
                    status: false,
                    message: `${areaName} already exist. Try again!`
                });
            } else {
                await prisma.deliveryCost.create({
                    data: {
                        areaName,
                        cost
                    }
                });

                return NextResponse.json({
                    status: true,
                    message: `DeliveryCost ${areaName} has been created successfully`
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
    let { id, areaName ,cost}: DeliveryCost = await request.json();
    const requiredPermission = 'delivery-costs';

    // if (await checkPermission(request, requiredPermission)) {
        try {
            await prisma.deliveryCost.update({
                where: {
                    id
                },
                data: {
              
                    areaName,
                    cost
                }
            });

            return NextResponse.json({
                message: `DeliveryCost ${areaName} has been update successfully`,
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
    const requiredPermission = 'delivery-costs';

    // if (await checkPermission(request, requiredPermission)) {
        try {
            if (id.length > 1) {
                await prisma.deliveryCost.deleteMany({
                    where: {
                        id: {
                            in: id
                        }
                    }
                });
                return NextResponse.json({
                    message: 'DeliveryCosts Delete has been successfully',
                    status: true
                });
            } else {
                await prisma.deliveryCost.delete({
                    where: {
                        id: id[0]
                    }
                });
                return NextResponse.json({
                    message: 'DeliveryCost Delete has been successfully',
                    status: true
                });
            }
        } catch (error: any) {
            if (error.code === 'P2003') {
                return NextResponse.json({
                    message: "Child value has existed, don't delete this deliveryCost",
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
    // } else {
    //     return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });
    // }
};

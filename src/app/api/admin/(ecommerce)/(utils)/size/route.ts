import { ISizedType } from '@/types/common';
import { checkPermission } from '@/utils/checkPermissions';
import prisma from '@/utils/connect';
import { NextRequest, NextResponse } from 'next/server';


export const GET = async (request: NextRequest) => {
    const requiredPermission = 'size';

    // if (await checkPermission(request, requiredPermission)) {
    try {
        const sized: ISizedType[] = await prisma.size.findMany({
            select: {
                id: true,
                title: true,
            }
        });
        return NextResponse.json(sized);
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
    let { title }: { title: string } = await request.json();
    const requiredPermission = 'size';
    
    // if (await checkPermission(request, requiredPermission)) {
    try {
        const exist: ISizedType | null = await prisma.size.findFirst({
            where: { title }
        });

        if (exist) {
            return NextResponse.json({
                status: false,
                message: `${title} already exist. Try again!`
            });
        }
        else {

            await prisma.size.create({
                data: {
                    title,
                }
            });

            return NextResponse.json({
                status: true,
                message: `Size ${title} has been created successfully`
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
    let { id, title }: { id: number, title: string } = await request.json();
    // const requiredPermission = 'products';

    // if (await checkPermission(request, requiredPermission)) {
    try {
        await prisma.size.update({
            where: {
                id
            },
            data: {
                title,
            }
        });

        return NextResponse.json({
            message: `Size ${title} has been update successfully`,
            status: true
        });
    } catch (error: any) {
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
    // const requiredPermission = 'size';

    // if (await checkPermission(request, requiredPermission)) {
    try {
        if (id.length > 1) {
            await prisma.size.deleteMany({
                where: {
                    id: {
                        in: id
                    }
                }
            });
            return NextResponse.json({
                message: 'Sizes Delete has been successfully',
                status: true
            });
        } else {
            await prisma.size.delete({
                where: {
                    id: id[0]
                }
            });
            return NextResponse.json({
                message: 'Size Delete has been successfully',
                status: true
            });
        }
    } catch (error: any) {
        return NextResponse.json({
            message: 'Something went wrong',
            error,
            status: false
        });
    }
    // } else {
    //     return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });
    // }
};

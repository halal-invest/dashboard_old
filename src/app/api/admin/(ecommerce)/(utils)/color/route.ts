import { checkPermission } from '@/utils/checkPermissions';
import prisma from '@/utils/connect';
import { NextRequest, NextResponse } from 'next/server';

interface Color {
    id: number;
    title: string;
    colorCode: string;
}

export const GET = async (request: NextRequest) => {
    const requiredPermission = 'colors';

    if (await checkPermission(request, requiredPermission)) {
        try {
            const colors: Color[] = await prisma.color.findMany();
            return NextResponse.json(colors);
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
    let { title, colorCode }: Color = await request.json();
    const requiredPermission = 'colors';

    if (await checkPermission(request, requiredPermission)) {
        try {
            const exist: Color | null = await prisma.color.findFirst({
                where: { title }
            });

            if (exist) {
                return NextResponse.json({
                    status: false,
                    message: `${title} already exist. Try again!`
                });
            } else {
                await prisma.color.create({
                    data: {
                        title,
                        colorCode
                    }
                });

                return NextResponse.json({
                    status: true,
                    message: `Color ${title} has been created successfully`
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
    let { id, title, colorCode }: Color = await request.json();
    const requiredPermission = 'colors';

    if (await checkPermission(request, requiredPermission)) {
        try {
            await prisma.color.update({
                where: {
                    id
                },
                data: {
                    title,
                    colorCode
                }
            });

            return NextResponse.json({
                message: `Color ${title} has been update successfully`,
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
    const requiredPermission = 'colors';

    if (await checkPermission(request, requiredPermission)) {
        try {
            if (id.length > 1) {
                await prisma.color.deleteMany({
                    where: {
                        id: {
                            in: id
                        }
                    }
                });
                return NextResponse.json({
                    message: 'Colors Delete has been successfully',
                    status: true
                });
            } else {
                await prisma.color.delete({
                    where: {
                        id: id[0]
                    }
                });
                return NextResponse.json({
                    message: 'Color Delete has been successfully',
                    status: true
                });
            }
        } catch (error: any) {
            if (error.code === 'P2003') {
                return NextResponse.json({
                    message: "Child value has existed, don't delete this color",
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

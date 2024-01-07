import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/utils/connect';
import { checkPermission } from '@/utils/checkPermissions';
import { redirect } from 'next/navigation';

export const GET = async (request: NextRequest) => {
    try {
        const project_types = await prisma.types.findMany();
        return NextResponse.json(project_types, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
};

export const POST = async (request: NextRequest) => {
    const requiredPermission = 'projects';
    const { title, description } = await request.json();
    if (await checkPermission(request, requiredPermission)) {
        try {
            const existTitle = await prisma.types.findUnique({
                where: {
                    title
                }
            });

            if (existTitle) {
                return NextResponse.json({
                    message: `Project Type ${title} already exist. Try again`,
                    status: false
                });
            }

            await prisma.types.create({
                data: {
                    title,
                    description
                }
            });
            return NextResponse.json({
                message: `Project Type ${title} has been created successfully`,
                status: true
            });
        } catch (error) {
            return NextResponse.json({ message: error }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: 'You are not allowed to create Project Type.', status: false });
    }
};

export const PATCH = async (request: NextRequest) => {
    const requiredPermission = 'projects';
    if (await checkPermission(request, requiredPermission)) {
        try {
            const { id, title, description } = await request.json();

            await prisma.types.update({
                where: {
                    id: id
                },
                data: {
                    title: title,
                    description: description
                }
            });
            return NextResponse.json({
                message: `Project Type ${title} has been update successfully`,
                status: true
            });
            // return NextResponse.json({name, phone})
        } catch (error) {
            return NextResponse.json({ message: error, status: 500 });
        }
    } else {
        return NextResponse.json({ message: 'You are not allowed to update Project Type.', status: false });
    }
};

export const DELETE = async (request: NextRequest) => {
    const requiredPermission = 'projects';
    const { id } = await request.json();

    if (await checkPermission(request, requiredPermission)) {
        try {
            if (id.length > 1) {
                await prisma.types.deleteMany({
                    where: {
                        id: {
                            in: id
                        }
                    }
                });
                return NextResponse.json({
                    message: 'Project Type Delete has been successfully',
                    status: true
                });
            } else {
                await prisma.types.delete({
                    where: {
                        id: id[0]
                    }
                });

                return NextResponse.json({
                    message: 'Project Type Delete has been successfully',
                    status: true
                });
            }
        } catch (error) {
            return NextResponse.json({ message: error }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: 'You are not allowed to delete Project Type.', status: false });
    }
};

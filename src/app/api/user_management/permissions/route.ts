import { NextResponse, NextRequest } from 'next/server';
import prisma from '../../../../utils/connect';
import { checkPermission } from '../../../../utils/checkPermissions';
import { redirect } from 'next/navigation';

export const GET = async (request: NextRequest) => {
    const requiredPermission = 'users_manage';

    if (await checkPermission(request, requiredPermission)) {
        try {
            const permissions = await prisma.permission.findMany({
                include: {
                    roles: true
                }
            });
            return NextResponse.json(permissions, { status: 200 });
        } catch (error) {
            return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
        }
    } else {
        return NextResponse.json(null, { status: 200 });
    }
};

export const POST = async (request: NextRequest) => {
    const requiredPermission = 'users_manage';
    const { title, description } = await request.json();
    if (await checkPermission(request, requiredPermission)) {
        try {
            const existTitle = await prisma.permission.findUnique({
                where: {
                    title
                }
            });

            if (existTitle) {
                return NextResponse.json({
                    message: `${title} already exist. Try again`,
                    status: false
                });
            }

            await prisma.permission.create({
                data: {
                    title,
                    description
                }
            });
            return NextResponse.json({
                message: `Permission ${title} has been created successfully`,
                status: true
            });
        } catch (error) {
            return NextResponse.json({ message: error }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: 'You are not allowed to create permission.', status: false });
    }
};

export const PATCH = async (request: NextRequest) => {
    const requiredPermission = 'users_manage';
    if (await checkPermission(request, requiredPermission)) {
        try {
            const { id, title, description } = await request.json();

            await prisma.permission.update({
                where: {
                    id: id
                },
                data: {
                    title: title,
                    description: description
                }
            });
            return NextResponse.json({
                message: `Permission ${title} has been update successfully`,
                status: true
            });
            // return NextResponse.json({name, phone})
        } catch (error) {
            return NextResponse.json({ message: error, status: 500 });
        }
    } else {
        return NextResponse.json({ message: 'You are not allowed to update permission.', status: false });
    }
};

export const DELETE = async (request: NextRequest) => {
    const requiredPermission = 'users_manage';
    const { id } = await request.json();
    const defaultPermissionIdObjects = await prisma.permission.findMany({
        where: {
            title: {
                in: ['users_manage', 'default_permission']
            }
        },
        select: {
            id: true
        }
    });
    const defaultPermissionIds = defaultPermissionIdObjects.map((obj) => obj.id);
    const deleteOrNot = defaultPermissionIds.some((item) => id.includes(item));

    if (await checkPermission(request, requiredPermission)) {
        try {
            if (id.length > 1) {
                if (deleteOrNot) {
                    return NextResponse.json({
                        message: `default permissions cannot be deleted.`,
                        status: false
                    });
                }
                await prisma.permission.deleteMany({
                    where: {
                        id: {
                            in: id
                        }
                    }
                });
                return NextResponse.json({
                    message: 'Permissions Delete has been successfully',
                    status: true
                });
            } else {
                if (deleteOrNot) {
                    return NextResponse.json({
                        message: `This default permission cannot be deleted.`,
                        status: false
                    });
                }
                await prisma.permission.delete({
                    where: {
                        id: id[0]
                    }
                });

                return NextResponse.json({
                    message: 'Permissions Delete has been successfully',
                    status: true
                });
            }
        } catch (error) {
            return NextResponse.json({ message: error }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: 'You are not allowed to delete permission.', status: false });
    }
};

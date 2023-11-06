import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../utils/connect';
import { checkPermission } from '@/utils/checkPermissions';

export const GET = async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const roleId = searchParams.get('id');
    const latest = searchParams.get('latest');
    const requiredPermission = 'users_manage';
    if (await checkPermission(request, requiredPermission)) {
        try {
            if (roleId) {
                const roles = await prisma.role.findMany({
                    where: {
                        id: +roleId
                    },
                    include: {
                        permissions: true
                    }
                });
                return NextResponse.json(roles, { status: 200 });
            } else {
                const roles = await prisma.role.findMany({
                    include: {
                        permissions: true
                    }
                });
                return NextResponse.json(roles, { status: 200 });
            }
        } catch (error) {
            return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
        }
    } else {
        return NextResponse.json(null, { status: 200 });
    }
};

export const POST = async (request: NextRequest) => {
    const { title, description, permissions } = await request.json();
    const requiredPermission = 'users_manage';

    if (await checkPermission(request, requiredPermission)) {
        try {
            const existRole = await prisma.role.findUnique({
                where: { title }
            });

            if (existRole) {
                return NextResponse.json({ message: 'Role exists with this title. Try another title', status: false });
            } else {
                await prisma.role.create({
                    data: {
                        title: title,
                        description: description,
                        permissions: {
                            connect: permissions.map((id: any) => ({ id }))
                        }
                    },
                    include: {
                        permissions: true
                    }
                });
                return NextResponse.json({ message: 'role created successfully', status: true });
            }
        } catch (error) {
            return NextResponse.json({ message: error, status: 500 });
        }
    } else {
        return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });
    }
};

export const PATCH = async (request: NextRequest) => {
    const requiredPermission = 'users_manage';

    if (await checkPermission(request, requiredPermission)) {
        try {
            const { id, title, description, permissions } = await request.json();
            const existingRole = prisma.role.update({
                where: {
                    id: id
                },
                data: {
                    permissions: { set: [] }
                }
            });

            const role = prisma.role.update({
                where: {
                    id: id
                },
                data: {
                    title: title,
                    description: description,
                    permissions: {
                        connect: permissions.map((id: any) => ({ id }))
                    }
                }
            });
            await prisma.$transaction([existingRole, role]);
            return NextResponse.json({
                message: `role ${title} has been update successfully`,
                status: true
            });
            // return NextResponse.json({name, phone})
        } catch (error) {
            return NextResponse.json({ message: error }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });
    }
};

export const DELETE = async (request: NextRequest) => {
    const requiredPermission = 'users_manage';
    const { id } = await request.json();
    const defaultRoleIdObjects = await prisma.role.findMany({
        where: {
            title: {
                in: ['admin', 'customer']
            }
        },
        select: {
            id: true
        }
    });
    const defaultRoleIds = defaultRoleIdObjects.map((obj) => obj.id);
    const deleteOrNot = defaultRoleIds.some((item) => id.includes(item));

    if (await checkPermission(request, requiredPermission)) {
        try {
            if (id.length > 1) {
                if (deleteOrNot) {
                    return NextResponse.json({
                        message: `default roles cannot be deleted.`,
                        status: false
                    });
                }
                await prisma.role.deleteMany({
                    where: {
                        id: {
                            in: id
                        }
                    }
                });
                return NextResponse.json({
                    message: 'Roles Delete has been successfully',
                    status: true
                });
            } else {
                if (deleteOrNot) {
                    return NextResponse.json({
                        message: `default roles cannot be deleted.`,
                        status: false
                    });
                }
                await prisma.role.delete({
                    where: {
                        id: id[0]
                    }
                });

                return NextResponse.json({
                    message: 'Roles Delete has been successfully',
                    status: true
                });
            }
        } catch (error) {
            return NextResponse.json({ message: error, status: 500 });
        }
    } else {
        return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });
    }
};

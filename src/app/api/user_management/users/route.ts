import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../utils/connect';
import { hash } from 'bcrypt';
import { checkPermission } from '@/utils/checkPermissions';
import { disconnect } from 'process';
export const GET = async (request: NextRequest) => {
    const requiredPermission = 'users_manage';
    if (await checkPermission(request, requiredPermission)) {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    verified: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
            return NextResponse.json(users, { status: 200 });
        } catch (error) {
            return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
        }
    } else {
        return NextResponse.json(null, { status: 200 });
    }
};

export const POST = async (request: NextRequest) => {
    const requiredPermission = 'users_manage';

    const { email, password, roles } = await request.json();
    if (await checkPermission(request, requiredPermission)) {
        try {
            const existUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existUser) {
                return NextResponse.json({ message: 'User exists with this email.', status: false });
            } else {
                const hashedPassword = await hash(password, 10);
                const newUser = await prisma.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        verified: true
                    }
                });

                const newProfile = await prisma.profile.create({
                    data: {
                        user: {
                            connect: { id: newUser?.id }
                        },
                        email: email,
                        roles: {
                            connect: roles.map((roleId: any) => ({ id: roleId }))
                        }
                    }
                });
                return NextResponse.json({ message: 'user created successfully', status: true });
            }
        } catch (error) {
            return NextResponse.json({ message: error, status: 500 });
        }
    } else {
        return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });
    }
};

export const PUT = async (request: NextRequest) => {
    const requiredPermission = 'users_manage';

    let hashedPassword;
    if (await checkPermission(request, requiredPermission)) {
        try {
            const { id, password, email, roles } = await request.json();

            const existingUser = await prisma.user.findUnique({
                where: {
                    id: id
                }
            });
            const existProfile = await prisma.profile.findFirst({
                where: {
                    userId: existingUser?.id
                },
                include: {
                    roles: true
                }
            });
            if (password) {
                hashedPassword = await hash(password, 10);
            } else {
                hashedPassword = existingUser?.password;
            }
            const updatedUser = prisma.user.update({
                where: {
                    id: id
                },
                data: {
                    password: hashedPassword,
                    email
                }
            });
            const updatedProfile = await prisma.profile.update({
                where: { id: existProfile?.id },
                data: {
                    roles: {
                        disconnect: existProfile?.roles,
                        connect: roles.map((roleId: any) => ({ id: roleId }))
                    }
                }
            });

            return NextResponse.json({
                message: `User ${name} has been updated successfully`,
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
    const defaultUserIdObjects = await prisma.user.findMany({
        where: {
            email: {
                in: ['alarafatsiddique@gmail.com']
            }
        },
        select: {
            id: true
        }
    });
    const defaultUserIds = defaultUserIdObjects.map((obj) => obj.id);
    const deleteOrNot = defaultUserIds.some((item) => id.includes(item));
    if (await checkPermission(request, requiredPermission)) {
        try {
            if (id.length > 1) {
                if (deleteOrNot) {
                    return NextResponse.json({
                        message: `default users cannot be deleted.`,
                        status: false
                    });
                }
                await prisma.user.deleteMany({
                    where: {
                        id: {
                            in: id
                        }
                    }
                });
                return NextResponse.json({
                    message: 'Users Delete has been successfully',
                    status: true
                });
            } else {
                if (deleteOrNot) {
                    return NextResponse.json({
                        message: `default users cannot be deleted.`,
                        status: false
                    });
                }
                await prisma.user.delete({
                    where: {
                        id: id[0]
                    }
                });

                return NextResponse.json({
                    message: 'Users Delete has been successfully',
                    status: true
                });
            }
        } catch (error) {
            return NextResponse.json({ message: error }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });
    }
};

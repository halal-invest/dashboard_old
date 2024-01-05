import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../utils/connect';
import { hash } from 'bcrypt';
import { checkPermission } from '@/utils/checkPermissions';
import { checkPermissionAndUser } from '@/utils/checkPermissionAndUser';
export const GET = async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const user_id_from_params = searchParams.get('userId');
    const admin_permission = 'users_manage';
    const investor_permission = 'investment';

    try {
        if (await checkPermission(request, admin_permission)) {
            if (user_id_from_params) {
                const user = await prisma.users.findFirst({
                    where: {
                        id: +user_id_from_params
                    },
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        whatsapp: true,
                        email_verified: true,
                        email: true,
                        phone: true,
                        phone_verified: true,
                        createdAt: true,
                        updatedAt: true,
                        isActive: true,
                        isDeleted: true,
                        roles: true
                    }
                });
                return NextResponse.json(user, { status: 200 });
            }
            const users = await prisma.users.findMany({
                select: {
                    id: true,
                    name: true,
                    address: true,
                    whatsapp: true,
                    email_verified: true,
                    email: true,
                    phone: true,
                    phone_verified: true,
                    createdAt: true,
                    updatedAt: true,
                    isActive: true,
                    isDeleted: true,
                    roles: true
                }
            });
            return NextResponse.json(users, { status: 200 });
        }
        if (user_id_from_params !== null && (await checkPermissionAndUser(request, investor_permission, +user_id_from_params))) {
            const user = await prisma.users.findFirst({
                where: {
                    id: +user_id_from_params
                }
            });
            return NextResponse.json(user, { status: 200 });
        } else {
            return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
};

// export const POST = async (request: NextRequest) => {
//     const requiredPermission = 'users_manage';

//     const { email, password, roles } = await request.json();
//     if (await checkPermission(request, requiredPermission)) {
//         try {
//             const existUser = await prisma.user.findFirst({
//                 where: { email },

//             });
//             const existUserPhone = await prisma.user.findFirst({
//                 where: { phone }
//             });

//             if (existUser) {
//                 return NextResponse.json({ message: 'User exists with this email.', status: false });
//             } else {
//                 const hashedPassword = await hash(password, 10);
//                 const newUser = await prisma.user.create({
//                     data: {
//                         email,
//                         password: hashedPassword,
//                         verified: true
//                     }
//                 });

//                 const newProfile = await prisma.profile.create({
//                     data: {
//                         user: {
//                             connect: { id: newUser?.id }
//                         },
//                         email: email,
//                         roles: {
//                             connect: roles.map((roleId: any) => ({ id: roleId }))
//                         }
//                     }
//                 });
//                 return NextResponse.json({ message: 'user created successfully', status: true });
//             }
//         } catch (error) {
//             return NextResponse.json({ message: error, status: 500 });
//         }
//     } else {
//         return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });
//     }
// };

export const PATCH = async (request: NextRequest) => {
    const requiredPermission = 'investor';

    let hashedPassword;
    if (await checkPermission(request, requiredPermission)) {
        try {
            const { id, name, address, whatsapp, password, email, email_verified, phone_verified, isDeleted, phone, roles, isActive } = await request.json();
            // console.log(id, name, address, whatsapp, email_verified, phone_verified, isDeleted, password, email, phone, roles, isActive);

            const existingUser = await prisma.users.findUnique({
                where: {
                    id: id
                },
                include: { roles: true }
            });

            if (email && email !== existingUser?.email) {
                const emailExistOrNot = await prisma.users.findFirst({
                    where: { email }
                });
                if (emailExistOrNot) {
                    return NextResponse.json({ message: 'Cannot update email. Another user exists with this email.', status: false });
                }
            }

            if (phone && phone !== existingUser?.phone) {
                const phoneExistOrNot = await prisma.users.findFirst({
                    where: { phone }
                });
                if (phoneExistOrNot) {
                    return NextResponse.json({ message: 'Cannot update phone. Another user exists with this phone.', status: false });
                }
            }
            if (password) {
                hashedPassword = await hash(password, 10);
            }
            if (!password) {
                console.log('no password');
                hashedPassword = existingUser?.password;
            }

            const updatedUser = await prisma.users.update({
                where: {
                    id: id
                },
                data: {
                    name,
                    address,
                    whatsapp,
                    password: hashedPassword,
                    email,
                    phone,
                    isActive,
                    isDeleted,
                    roles: {
                        disconnect: existingUser?.roles,
                        connect: roles.map((roleId: any) => ({ id: roleId }))
                    },
                    email_verified,
                    phone_verified
                }
            });

            return NextResponse.json({
                user: updatedUser,
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
    const { searchParams } = new URL(request.url);
    const softDelete = searchParams.get('softDelete');
    console.log(softDelete);

    const { id } = await request.json();
    console.log(id);
    const defaultUser = await prisma.users.findFirst({
        where: { email: 'alarafatsiddique@gmail.com' }
    });

    const deleteOrNot = id.includes(defaultUser?.id);
    console.log(deleteOrNot);
    if (await checkPermission(request, requiredPermission)) {
        try {
            if (id.length > 1) {
                if (deleteOrNot) {
                    return NextResponse.json({
                        message: `default users cannot be deleted.`,
                        status: false
                    });
                }
                if (softDelete) {
                    await prisma.users.updateMany({
                        where: {
                            id: {
                                in: id
                            }
                        },
                        data: {
                            isDeleted: true
                        }
                    });
                }
                if (!softDelete) {
                    await prisma.users.deleteMany({
                        where: {
                            id: {
                                in: id
                            }
                        }
                    });
                }

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
                if (softDelete) {
                    await prisma.users.update({
                        where: {
                            id: id[0]
                        },
                        data: {
                            isDeleted: true
                        }
                    });
                }
                if (!softDelete) {
                    await prisma.users.delete({
                        where: {
                            id: id[0]
                        }
                    });
                }

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

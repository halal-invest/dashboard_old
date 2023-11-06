import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../utils/connect';
import { hash } from 'bcrypt';
import { checkPermission } from '@/utils/checkPermissions';
import { disconnect } from 'process';
export const GET = async (request: NextRequest) => {
    const requiredPermission = 'users_manage';
    if (await checkPermission(request, requiredPermission)) {
    try {
        const profiles = await prisma.profile.findMany({
            include: { roles: true }
        });
        return NextResponse.json(profiles, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
    } else {
        return NextResponse.json(null, { status: 200 });
    }
};

// export const POST = async (request: NextRequest) => {
//     const requiredPermission = 'users_manage';

//     const { email, password, roles } = await request.json();
//     // if (await checkPermission(request, requiredPermission)) {
//         try {
//             const existUser = await prisma.user.findUnique({
//                 where: { email }
//             });

//             if (existUser) {
//                 return NextResponse.json({ message: 'User exists with this email.', status: false });
//             } else {
//                 const hashedPassword = await hash(password, 10);
//                 const newUser = await prisma.user.create({
//                     data: {
//                         email,
//                         password: hashedPassword,
//                         verified:true
//                     },
//                 });

//                 const newProfile = await prisma.profile.create({
//                     data: {

//                         user:{
//                             connect: {id:newUser?.id}
//                         },
//                         roles:{
//                             connect: {id:roles?.id}
//                         }
//                     }
//                 })
//                 return NextResponse.json({ message: 'user created successfully', status: true });
//             }
//         } catch (error) {
//             return NextResponse.json({ message: error, status: 500 });
//         }
//     // } else {
// return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });

//     // }
// };

export const PUT = async (request: NextRequest) => {
    const requiredPermission = 'users_manage';

    let hashedPassword;
    if (await checkPermission(request, requiredPermission)) {
    try {
        let { id, name, email, phone, roles, address, city, country, postal_code } = await request.json();

        const existProfile = await prisma.profile.findFirst({
            where: {
                id: id
            },
            include: {
                roles: true
            }
        });

        if (existProfile?.userId === null) {
            phone = existProfile.phone;
        }
        if (existProfile?.otpUserId === null) {
            email = existProfile.email;
        }

        const updatedProfile = await prisma.profile.update({
            where: { id: existProfile?.id },
            data: {
                name: name,
                email: email,
                phone: phone,
                address: address,
                postal_code: postal_code,
                city: city,
                country: country,
                roles: {
                    disconnect: existProfile?.roles,
                    connect: roles.map((roleId: any) => ({ id: roleId }))
                }
            }
        });

        return NextResponse.json({
            message: `profile ${name} has been updated successfully`,
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
    const defaultUserIdObjects = await prisma.profile.findMany({
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

            for (let i = 0; i < id.length; i++) {
                const profile = await prisma.profile.findFirst({
                    where: {
                        id: id[i]
                    }
                });
                //for phone-otp user
                if (profile?.otpUserId !== null) {
                    await prisma.otpUser.delete({
                        where: { id: profile?.otpUserId }
                    });
                    await prisma.profile.delete({
                        where: { id: profile?.id }
                    });
                }
                //for email-password user
                if (profile?.userId !== null) {
                    await prisma.user.delete({
                        where: { id: profile?.userId }
                    });
                    await prisma.profile.delete({
                        where: { id: profile?.id }
                    });
                }
            }

            return NextResponse.json({
                message: 'Profiles Delete has been successfully',
                status: true
            });
        } else {
            if (deleteOrNot) {
                return NextResponse.json({
                    message: `default users cannot be deleted.`,
                    status: false
                });
            }
            const profile = await prisma.profile.findFirst({
                where: {
                    id: id[0]
                }
            });
            //for phone-otp user
            if (profile?.otpUserId !== null) {
                await prisma.otpUser.delete({
                    where: { id: profile?.otpUserId }
                });
                await prisma.profile.delete({
                    where: { id: profile?.id }
                });
            }
            //for email-password user
            if (profile?.userId !== null) {
                await prisma.user.delete({
                    where: { id: profile?.userId }
                });
                await prisma.profile.delete({
                    where: { id: profile?.id }
                });
            }

            return NextResponse.json({
                message: 'Profiles Delete has been successfully',
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

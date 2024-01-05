import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../utils/connect';
import { checkPermission } from '@/utils/checkPermissions';
import { checkPermissionAndUser } from '@/utils/checkPermissionAndUser';


export const GET = async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const user_id_from_params = searchParams.get('userId');
    console.log(user_id_from_params);
    const admin_permission = 'users_manage';
    const investor_permission = 'investment';

    try {
        if (await checkPermission(request, admin_permission)) {
            if (user_id_from_params) {
                const user_profile = await prisma.profiles.findFirst({
                    where: {
                        user_id: +user_id_from_params
                    }
                });
                return NextResponse.json(user_profile, { status: 200 });
            }
            const profiles = await prisma.profiles.findMany();
            return NextResponse.json(profiles, { status: 200 });
        }
        if (user_id_from_params !== null && (await checkPermissionAndUser(request, investor_permission, +user_id_from_params))) {
            const user_profile = await prisma.profiles.findFirst({
                where: {
                    user_id: +user_id_from_params
                }
            });
            return NextResponse.json(user_profile, { status: 200 });
        }
        return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });
    } catch (error) {
        return NextResponse.json(error);
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

export const PATCH = async (request: NextRequest) => {
    let {
        name, 
        personal_photo,
        father_name,
        job_title,
        dob,
        facebook_profile,
        whatsapp_no,
        repayment_method,
        nid,
        account_holders_name,
        branch_name,
        routing_no,
        district,
        bkash_no,
        nominee_nid,
        nominee_name,
        nominee_phone,
        gender,
        bank_name,
        account_no,
        address,
        city,
        country,
        postal_code
    } = await request.json();
    const { searchParams } = new URL(request.url);
    const user_id_from_params = searchParams.get('userId');
    const investor_permission = 'investment';
    const admin_permission = 'users_manage';

    try {
        if (user_id_from_params !== null && await checkPermission(request, admin_permission)) {
            const updateUser = await prisma.users.update({
                where:{id: +user_id_from_params},
                data: {
                    name:name,
                    address: address,
                    whatsapp:whatsapp_no
                }
            })
            const updatedProfile = await prisma.profiles.update({
                where: { user_id: +user_id_from_params },
                data: {
                    personal_photo,
                    father_name,
                    job_title,
                    dob,
                    address,
                    city,
                    country,
                    postal_code,
                    facebook_profile,
                    whatsapp_no,
                    nid,
                    repayment_method,
                    nominee_name,
                    nominee_nid,
                    nominee_phone,
                    gender,
                    bank_name,
                    account_no,
                    account_holders_name,
                    branch_name,
                    routing_no,
                    district,
                    bkash_no
                }
            });

            return NextResponse.json({
                message: `profile has been updated successfully`,
                status: true
            });
        }
        if (user_id_from_params !== null && (await checkPermissionAndUser(request, investor_permission, +user_id_from_params))) {
            const updateUser = await prisma.users.update({
                where:{id: +user_id_from_params},
                data: {
                    name:name,
                    address: address,
                    whatsapp:whatsapp_no
                }
            })
            const updatedProfile = await prisma.profiles.update({
                where: { user_id: +user_id_from_params },
                data: {
                    personal_photo,
                    father_name,
                    job_title,
                    dob,
                    address,
                    city,
                    country,
                    postal_code,
                    facebook_profile,
                    whatsapp_no,
                    nid,
                    repayment_method,
                    nominee_name,
                    nominee_nid,
                    nominee_phone,
                    gender,
                    bank_name,
                    account_no,
                    account_holders_name,
                    branch_name,
                    routing_no,
                    district,
                    bkash_no
                }
            });

            return NextResponse.json({
                message: `profile has been updated successfully`,
                status: true
            });
        }

        return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: error }, { status: 500 });
    }
};

// export const DELETE = async (request: NextRequest) => {
//     const requiredPermission = 'users_manage';
//     const { id } = await request.json();
//     const defaultUserIdObjects = await prisma.profile.findMany({
//         where: {
//             email: {
//                 in: ['alarafatsiddique@gmail.com']
//             }
//         },
//         select: {
//             id: true
//         }
//     });
//     const defaultUserIds = defaultUserIdObjects.map((obj) => obj.id);
//     const deleteOrNot = defaultUserIds.some((item) => id.includes(item));
//     if (await checkPermission(request, requiredPermission)) {
//         try {
//             if (id.length > 1) {
//                 if (deleteOrNot) {
//                     return NextResponse.json({
//                         message: `default users cannot be deleted.`,
//                         status: false
//                     });
//                 }

//                 for (let i = 0; i < id.length; i++) {
//                     const profile = await prisma.profile.findFirst({
//                         where: {
//                             id: id[i]
//                         }
//                     });
//                     //for phone-otp user
//                     if (profile?.otpUserId !== null) {
//                         await prisma.otpUser.delete({
//                             where: { id: profile?.otpUserId }
//                         });
//                         await prisma.profile.delete({
//                             where: { id: profile?.id }
//                         });
//                     }
//                     //for email-password user
//                     if (profile?.userId !== null) {
//                         await prisma.user.delete({
//                             where: { id: profile?.userId }
//                         });
//                         await prisma.profile.delete({
//                             where: { id: profile?.id }
//                         });
//                     }
//                 }

//                 return NextResponse.json({
//                     message: 'Profiles Delete has been successfully',
//                     status: true
//                 });
//             } else {
//                 if (deleteOrNot) {
//                     return NextResponse.json({
//                         message: `default users cannot be deleted.`,
//                         status: false
//                     });
//                 }
//                 const profile = await prisma.profile.findFirst({
//                     where: {
//                         id: id[0]
//                     }
//                 });
//                 //for phone-otp user
//                 if (profile?.otpUserId !== null) {
//                     await prisma.otpUser.delete({
//                         where: { id: profile?.otpUserId }
//                     });
//                     await prisma.profile.delete({
//                         where: { id: profile?.id }
//                     });
//                 }
//                 //for email-password user
//                 if (profile?.userId !== null) {
//                     await prisma.user.delete({
//                         where: { id: profile?.userId }
//                     });
//                     await prisma.profile.delete({
//                         where: { id: profile?.id }
//                     });
//                 }

//                 return NextResponse.json({
//                     message: 'Profiles Delete has been successfully',
//                     status: true
//                 });
//             }
//         } catch (error) {
//             return NextResponse.json({ message: error }, { status: 500 });
//         }
//     } else {
//         return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });
//     }
// };

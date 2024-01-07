import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../utils/connect';
import { checkPermission } from '@/utils/checkPermissions';
import { checkPermissionAndUser } from '@/utils/checkPermissionAndUser';
import { ADMIN_PERMISSION, INVESTOR_PERMISSION } from '@/utils/permissions';

export const GET = async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const user_id_from_params = searchParams.get('userId');
    
    let single_profile;
    let user;
    try {
        if (user_id_from_params) {
            user = await prisma.users.findFirst({
                where: {
                    id: +user_id_from_params
                },
                select: {
                    name: true
                }
            });
            single_profile = await prisma.profiles.findFirst({
                where: {
                    user_id: +user_id_from_params
                }
            });
        }

        const user_info = {
            id: single_profile?.id,
            name: user?.name,
            personal_photo: single_profile?.personal_photo,
            father_name: single_profile?.father_name,
            job_title: single_profile?.job_title,
            dob: single_profile?.dob,
            address: single_profile?.address,
            city: single_profile?.city,
            country: single_profile?.country,
            postal_code: single_profile?.postal_code,
            facebook_profile: single_profile?.facebook_profile,
            whatsapp_no: single_profile?.whatsapp_no,
            repayment_method: single_profile?.repayment_method,
            nid: single_profile?.nid,
            nominee_nid: single_profile?.nominee_nid,
            nominee_name: single_profile?.nominee_name,
            nominee_phone: single_profile?.nominee_phone,
            gender: single_profile?.gender,
            bank_name: single_profile?.bank_name,
            account_no: single_profile?.account_no,
            account_holders_name: single_profile?.account_holders_name,
            branch_name: single_profile?.branch_name,
            routing_no: single_profile?.routing_no,
            district: single_profile?.routing_no,
            bkash_no: single_profile?.bkash_no,
            created_at: single_profile?.created_at,
            updated_at: single_profile?.updated_at
        };
        if (await checkPermission(request, ADMIN_PERMISSION)) {
            if (user_id_from_params) {
                return NextResponse.json(user_info, { status: 200 });
            }
            const profiles = await prisma.profiles.findMany();
            return NextResponse.json(profiles, { status: 200 });
        }
        if (user_id_from_params !== null && (await checkPermissionAndUser(request, INVESTOR_PERMISSION, +user_id_from_params))) {
            return NextResponse.json(user_info, { status: 200 });
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

    try {
        if (user_id_from_params !== null && (await checkPermission(request, ADMIN_PERMISSION))) {
            const updateUser = await prisma.users.update({
                where: { id: +user_id_from_params },
                data: {
                    name: name,
                    address: address,
                    whatsapp: whatsapp_no
                }
            });
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
        if (user_id_from_params !== null && (await checkPermissionAndUser(request, INVESTOR_PERMISSION, +user_id_from_params))) {
            const updateUser = await prisma.users.update({
                where: { id: +user_id_from_params },
                data: {
                    name: name,
                    address: address,
                    whatsapp: whatsapp_no
                }
            });
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

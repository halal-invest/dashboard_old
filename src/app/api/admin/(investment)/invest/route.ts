import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/utils/connect';
import { checkPermission } from '@/utils/checkPermissions';
import { checkPermissionAndUser } from '@/utils/checkPermissionAndUser';
import { ADMIN_PERMISSION, INVESTOR_PERMISSION } from '@/utils/permissions';

import { string, number, object, ref, date } from 'yup';
import sanitize from 'sanitize-html';
import { getUserEmail } from '@/utils/common_functions';
import { sendEmailWithNodemailer } from '@/utils/emails';
const schema = object().shape({
    user_id: number().required(),
    project_id: number().required(),
    amount: string().required(),
    payment_method: string().required(),
    payment_date: date().required()
});
export const GET = async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const invest_status = searchParams.get('status');
    const user_id_from_params = searchParams.get('userId');
    // console.log(invest_status, user_id_from_params);
    try {
        if (await checkPermission(request, ADMIN_PERMISSION)) {
            if (invest_status !== null && user_id_from_params === null) {
                const invests = await prisma.invests.findMany({
                    where: {
                        approved: invest_status
                    }
                });
                return NextResponse.json(invests, { status: 200 });
            }
            if (invest_status !== null && user_id_from_params !== null) {
                const invests = await prisma.invests.findMany({
                    where: {
                        approved: invest_status,
                        user_id: +user_id_from_params
                    }
                });
                return NextResponse.json(invests, { status: 200 });
            }
            if (invest_status === null && user_id_from_params !== null) {
                const invests = await prisma.invests.findMany({
                    where: {
                        user_id: +user_id_from_params
                    }
                });
                return NextResponse.json(invests, { status: 200 });
            }
            if (invest_status === null && user_id_from_params === null) {
                const invests = await prisma.invests.findMany({});
                return NextResponse.json(invests, { status: 200 });
            }
        }
        if (user_id_from_params !== null && (await checkPermissionAndUser(request, INVESTOR_PERMISSION, +user_id_from_params))) {
            if (invest_status !== null && user_id_from_params !== null) {
                const invests = await prisma.invests.findMany({
                    where: {
                        approved: invest_status,
                        user_id: +user_id_from_params
                    }
                });
                return NextResponse.json(invests, { status: 200 });
            }
            if (invest_status === null && user_id_from_params !== null) {
                const invests = await prisma.invests.findMany({
                    where: {
                        user_id: +user_id_from_params
                    }
                });
                return NextResponse.json(invests, { status: 200 });
            }
        }

        return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
};

export const POST = async (request: NextRequest) => {
    const { user_id, project_id, amount, phone_no, transaction_no, payment_method, payment_date, image_1, image_2, approved, receipt_sent, auth_letter_sent, deed_sent, approval_no, admin_comment, investor_comment, comments } = await request.json();
    if (await checkPermission(request, INVESTOR_PERMISSION)) {
        try {
            const cleanInput = {
                user_id: sanitize(user_id),
                project_id: sanitize(project_id),
                amount: sanitize(amount),
                payment_method: sanitize(payment_method),
                payment_date: sanitize(payment_date)
            };
            await schema.validate(cleanInput);
            const profile_info = await prisma.profiles.findFirst({
                where: {
                    user_id: user_id
                }
            });
            if (!profile_info) {
                return NextResponse.json({
                    message: `Please update your profile first to invest`,
                    status: false
                });
            }
            if (
                payment_method === 'BankOnlineTransfer' &&
                profile_info?.account_holders_name !== null &&
                profile_info?.account_no !== null &&
                profile_info?.bank_name !== null &&
                profile_info?.branch_name !== null &&
                profile_info?.routing_no !== null
            ) {
                return NextResponse.json({
                    message: `Please update your profile first to invest`,
                    status: false
                });
            }
            if (payment_method === 'Bkash' && profile_info?.bkash_no !== null) {
                return NextResponse.json({
                    message: `Please update your profile first to invest`,
                    status: false
                });
            }
            const project_info = await prisma.projects.findFirst({
                where: {
                    id: project_id
                }
            })
            const raised_amount = await prisma.invests.aggregate({
                _sum: amount,
                where:{
                    project_id: project_id,
                    AND: [
                        {approved: 'approved'},
                        {approved: 'pending'}
                    ]
                }
            })
            // if(project_info?.investment_goal){
            //     const allowed_investment = +project_info?.investment_goal - raised_amount;

            // }
            
            

            const new_invest = await prisma.invests.create({
                data: {
                    user_id,
                    project_id,
                    amount,
                    phone_no,
                    transaction_no,
                    payment_method,
                    payment_date,
                    image_1,
                    image_2,
                    approved,
                    receipt_sent,
                    auth_letter_sent,
                    deed_sent,
                    approval_no,
                    admin_comment,
                    investor_comment,
                    comments
                }
            });
            if (new_invest) {
                const user_email = await getUserEmail(user_id);
                const emailData = {
                    from: `${process.env.EMAIL_USER}`,
                    to: user_email,
                    subject: 'Investment Application Submitted.',
                    html: ` <h4>Greetings! You've submitted the investment application successfully. </h4> `
                };
                sendEmailWithNodemailer(emailData);
            }

            return NextResponse.json({
                message: `Investment has been created successfully`,
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

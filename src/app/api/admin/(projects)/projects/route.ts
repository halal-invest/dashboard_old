import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/utils/connect';
import { checkPermission } from '@/utils/checkPermissions';
import slugify from 'slugify';

export const GET = async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const project_id = searchParams.get('id');
    // console.log(project_id);
    try {
        if (project_id) {
            const single_project = await prisma.projects.findFirst({
                where: {
                    id: +project_id
                },
                include: {
                    type: true
                }
            });
            return NextResponse.json(single_project, { status: 200 });
        }
        const projects = await prisma.projects.findMany({
            include: {
                type: true
            }
        });
        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
};

export const POST = async (request: NextRequest) => {
    const requiredPermission = 'projects';
    const {
        active,
        type_id,
        user_id,
        title,
        description,
        repayment_type,
        fixed_percent,
        image_1,
        image_2,
        image_3,
        location,
        duration,
        investment_goal,
        min_investment,
        projected_roi,
        commission,
        profit,
        risk_grade,
        repayment,
        project_duration,
        raised,
        being_processed,
        start_date_to_invest,
        last_date_to_invest,
        overview,
        deed,
        letter_of_authorization,
        letter_of_authorization_bangla,
        payment_schedule,
        downloadableUrl,
        intro_description,
        intro_explore_fb,
        intro_explore_website,
        intro_explore_linkedin,
        intro_office_address,
        intro_owners_description,
        intro_value_proposition,
        contract_durationOfInvestment_description,
        contract_projected_roi_description,
        contract_conditions,
        shariah_underlying_contracts_description,
        shariah_approval_from_scholars_description,
        risks_business_assessment,
        risks_possession_of_assets,
        risks_repayment_delay,
        risks_security,
        disclaimer,
        showing_related_updates,
        slug
    } = await request.json();
    if (await checkPermission(request, requiredPermission)) {
        try {
            const existTitle = await prisma.projects.findUnique({
                where: {
                    title
                }
            });

            if (existTitle) {
                return NextResponse.json({
                    message: `Project  ${title} already exist. Try again`,
                    status: false
                });
            }
            let slugified;
            if (!slug) {
                slugified = slugify(title);
            }
            if (slug) {
                slugified = slug;
            }

            await prisma.projects.create({
                data: {
                    active,
                    type_id,
                    user_id,
                    title,
                    description,
                    repayment_type,
                    fixed_percent,
                    image_1,
                    image_2,
                    image_3,
                    location,
                    duration,
                    investment_goal,
                    min_investment,
                    project_duration,
                    commission,
                    profit,
                    risk_grade,
                    repayment,
                    projected_roi,
                    raised,
                    being_processed,
                    start_date_to_invest,
                    last_date_to_invest,
                    overview,
                    deed,
                    letter_of_authorization,
                    letter_of_authorization_bangla,
                    payment_schedule,
                    downloadableUrl,
                    intro_description,
                    intro_explore_fb,
                    intro_explore_linkedin,
                    intro_explore_website,
                    intro_office_address,
                    intro_owners_description,
                    intro_value_proposition,
                    contract_durationOfInvestment_description,
                    contract_projected_roi_description,
                    contract_conditions,
                    shariah_approval_from_scholars_description,
                    shariah_underlying_contracts_description,
                    risks_business_assessment,
                    risks_possession_of_assets,
                    risks_repayment_delay,
                    risks_security,
                    disclaimer,
                    showing_related_updates,
                    slug: slugified
                }
            });
            return NextResponse.json({
                message: `Project  ${title} has been created successfully`,
                status: true
            });
        } catch (error) {
            return NextResponse.json({ message: error }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: 'You are not allowed to create Project .', status: false });
    }
};

export const PATCH = async (request: NextRequest) => {
    const requiredPermission = 'projects';
    if (await checkPermission(request, requiredPermission)) {
        try {
            const {
                id,
                active,
                type_id,
                user_id,
                title,
                description,
                repayment_type,
                fixed_percent,
                image_1,
                image_2,
                image_3,
                location,
                duration,
                investment_goal,
                min_investment,
                projected_roi,
                commission,
                profit,
                risk_grade,
                repayment,
                project_duration,
                raised,
                being_processed,
                start_date_to_invest,
                last_date_to_invest,
                overview,
                deed,
                letter_of_authorization,
                letter_of_authorization_bangla,
                payment_schedule,
                downloadableUrl,
                intro_description,
                intro_explore_fb,
                intro_explore_website,
                intro_explore_linkedin,
                intro_office_address,
                intro_owners_description,
                intro_value_proposition,
                contract_durationOfInvestment_description,
                contract_projected_roi_description,
                contract_conditions,
                shariah_underlying_contracts_description,
                shariah_approval_from_scholars_description,
                risks_business_assessment,
                risks_possession_of_assets,
                risks_repayment_delay,
                risks_security,
                disclaimer,
                showing_related_updates,
                slug
            } = await request.json();

            await prisma.projects.update({
                where: {
                    id: id
                },
                data: {
                    active,
                    type_id,
                    user_id,
                    title,
                    description,
                    repayment_type,
                    fixed_percent,
                    image_1,
                    image_2,
                    image_3,
                    location,
                    duration,
                    investment_goal,
                    min_investment,
                    project_duration,
                    commission,
                    profit,
                    risk_grade,
                    repayment,
                    projected_roi,
                    raised,
                    being_processed,
                    start_date_to_invest,
                    last_date_to_invest,
                    overview,
                    deed,
                    letter_of_authorization,
                    letter_of_authorization_bangla,
                    payment_schedule,
                    downloadableUrl,
                    intro_description,
                    intro_explore_fb,
                    intro_explore_linkedin,
                    intro_explore_website,
                    intro_office_address,
                    intro_owners_description,
                    intro_value_proposition,
                    contract_durationOfInvestment_description,
                    contract_projected_roi_description,
                    contract_conditions,
                    shariah_approval_from_scholars_description,
                    shariah_underlying_contracts_description,
                    risks_business_assessment,
                    risks_possession_of_assets,
                    risks_repayment_delay,
                    risks_security,
                    disclaimer,
                    showing_related_updates,
                    slug
                }
            });
            return NextResponse.json({
                message: `Project  ${title} has been update successfully`,
                status: true
            });
            // return NextResponse.json({name, phone})
        } catch (error) {
            return NextResponse.json({ message: error, status: 500 });
        }
    } else {
        return NextResponse.json({ message: 'You are not allowed to update Project .', status: false });
    }
};

export const DELETE = async (request: NextRequest) => {
    const requiredPermission = 'projects';
    const { id } = await request.json();

    if (await checkPermission(request, requiredPermission)) {
        try {
            if (id.length > 1) {
                await prisma.projects.deleteMany({
                    where: {
                        id: {
                            in: id
                        }
                    }
                });
                return NextResponse.json({
                    message: 'Project  Delete has been successfully',
                    status: true
                });
            } else {
                await prisma.projects.delete({
                    where: {
                        id: id[0]
                    }
                });

                return NextResponse.json({
                    message: 'Project  Delete has been successfully',
                    status: true
                });
            }
        } catch (error) {
            return NextResponse.json({ message: error }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: 'You are not allowed to delete Project .', status: false });
    }
};

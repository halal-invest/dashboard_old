import { ICouponType } from "@/types/common";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import slugify from "slugify";

interface IRequest {
    title: string;
    discount: number;
    type: string;
    status: boolean;
}

export const GET = async (request: Request) => {
    try {
        const coupons: ICouponType[] = await prisma.coupon.findMany();
        return NextResponse.json(coupons);
    } catch (error) {
        return NextResponse.json({
            status: false,
            error,
            message: 'Something went wrong !'
        });
    }
}

export const POST = async (request: Request) => {

    const { title, discount, type, status }: IRequest = await request.json();

    try {
        const exist: ICouponType | null = await prisma.coupon.findFirst({
            where: { title }
        });

        if (exist) {
            return NextResponse.json({
                status: false,
                message: `${title} already exist. Try again!`
            })
        }
        else {
            await prisma.coupon.create({
                data: {
                    title,
                    slug: slugify(title),
                    discount,
                    status,
                    type
                }
            });

            return NextResponse.json({
                status: true,
                message: `${title} has been created successfully`
            });
        };

    } catch (error) {
        return NextResponse.json({
            status: false,
            error,
            message: 'Something went wrong !'
        });
    }
}

export const PATCH = async (req: Request) => {
    const { id, title, status, discount, type }: ICouponType = await req.json();

    try {
        await prisma.coupon.update({
            where: {
                id
            },
            data: {
                title,
                slug: slugify(title),
                discount,
                status,
                type
            }
        });

        return NextResponse.json({
            message: `${title} has been update successfully`,
            status: true
        });

    } catch (error: any) {
        if (error.code == 'P2002') {
            return NextResponse.json({
                message: "Same title already exist. Try again",
                status: false
            });
        }
        return NextResponse.json({
            message: "Something went wrong",
            status: true
        });
    }
};

export const DELETE = async (req: Request) => {

    const { id }: { id: number[] } = await req.json();

    try {

        if (id.length > 1) {
            await prisma.coupon.deleteMany({
                where: {
                    id: {
                        in: id,
                    }
                }
            })
            return NextResponse.json({
                message: "Coupons Delete has been successfully",
                status: true
            });
        }
        else {
            await prisma.coupon.delete({
                where: {
                    id: id[0],
                }
            })
            return NextResponse.json({
                message: "Coupon Delete has been successfully",
                status: true
            });
        }

    } catch (error) {
        return NextResponse.json({
            message: "Something went wrong",
            error,
            status: false
        })
    }
}
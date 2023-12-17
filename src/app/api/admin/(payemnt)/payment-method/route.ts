import { IPaymentMethodType } from "@/types/common";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";


interface IRequest {
    title: string;
    description: string;
}

interface IPatch extends IRequest {
    id: number;
}


export const GET = async (request: Request) => {
    try {
        const paymentMethods: IPaymentMethodType[] = await prisma.paymentMethod.findMany({});
        return NextResponse.json(paymentMethods);
    } catch (error) {
        return NextResponse.json({
            status: false,
            error,
            message: 'Something went wrong !'
        });
    }
}

export const POST = async (request: Request) => {

    const { title, description }: IRequest = await request.json();

    try {
        const exist: IPaymentMethodType | null = await prisma.paymentMethod.findFirst({
            where: { title }
        });

        if (exist) {
            return NextResponse.json({
                status: false,
                message: `${title} already exist. Try again!`
            })
        }
        else {
            await prisma.paymentMethod.create({
                data: {
                    title,
                    description,
                }
            });

            return NextResponse.json({
                status: true,
                message: `Payment Method ${title} has been created successfully`
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
    const { id, title, description }: IPatch = await req.json();

    try {
        await prisma.paymentMethod.update({
            where: {
                id
            },
            data: {
                title,
                description
            }
        });

        return NextResponse.json({
            message: `Payment Method ${title} has been update successfully`,
            status: true
        });

    } catch (error: any) {
        return NextResponse.json({
            message: "Something went wrong",
            status: false
        });
    }
};

export const DELETE = async (req: Request) => {

    const { id }: { id: number[] } = await req.json();

    try {

        if (id.length > 1) {
            await prisma.paymentMethod.deleteMany({
                where: {
                    id: {
                        in: id,
                    }
                }
            })
            return NextResponse.json({
                message: "Payment Methods Delete has been successfully",
                status: true
            });
        }
        else {
            await prisma.paymentMethod.delete({
                where: {
                    id: id[0],
                }
            })
            return NextResponse.json({
                message: "Payment Method Delete has been successfully",
                status: true
            });
        }

    } catch (error: any) {
        return NextResponse.json({
            message: "Something went wrong",
            error,
            status: false
        })

    }
}
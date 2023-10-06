import { IShippingType } from "@/types/common";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";


interface IRequest {
    title: string;
    cost: number;
    description: string;
}

interface IPatch extends IRequest {
    id: number;
}


export const GET = async (request: Request) => {
    try {
        const shippings: IShippingType[] = await prisma.shipping.findMany();
        return NextResponse.json(shippings);
    } catch (error) {
        return NextResponse.json({
            status: false,
            error,
            message: 'Something went wrong !'
        });
    }
}

export const POST = async (request: Request) => {

    const { title, cost, description }: IRequest = await request.json();

    try {
        const exist: IShippingType | null = await prisma.shipping.findUnique({
            where: { title }
        });

        if (exist) {
            return NextResponse.json({
                status: false,
                message: `${title} already exist. Try again!`
            })
        }
        else {
            await prisma.shipping.create({
                data: {
                    title,
                    cost,
                    description,
                }
            });

            return NextResponse.json({
                status: true,
                message: `Shipping ${title} has been created successfully`
            });
        };

    } catch (error) {
        return NextResponse.json({
            status: false,
            error,
            message: 'Something went wrong !'
        });
    }
};

export const PATCH = async (req: Request) => {
    const { id, title, cost, description }: IPatch = await req.json();

    try {
        await prisma.shipping.update({
            where: {
                id
            },
            data: {
                title,
                cost,
                description
            }
        });

        return NextResponse.json({
            message: `Shipping ${title} has been update successfully`,
            status: true
        });

    } catch (error: any) {

        if (error.code = 'P2002') {
            return NextResponse.json({
                message: "Title already exist",
                status: false
            });
        }

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
            await prisma.shipping.deleteMany({
                where: {
                    id: {
                        in: id,
                    }
                }
            })
            return NextResponse.json({
                message: "Shippings Delete has been successfully",
                status: true
            });
        }
        else {
            await prisma.shipping.delete({
                where: {
                    id: id[0],
                }
            })
            return NextResponse.json({
                message: "Shipping Delete has been successfully",
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
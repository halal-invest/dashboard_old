import { ISliderType } from "@/types/common";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";


interface IRequest {
    image: string;
    description: string | null;
}

interface IPatch extends IRequest {
    id: number;
}


export const GET = async (request: Request) => {
    try {
        const sliders: ISliderType[] = await prisma.slider.findMany();
        return NextResponse.json(sliders);
    } catch (error) {
        return NextResponse.json({
            status: false,
            error,
            message: 'Something went wrong !'
        });
    }
}

export const POST = async (request: Request) => {

    const { image, description }: IRequest = await request.json();

    try {
        
            await prisma.slider.create({
                data: {
                    image,
                    description,
                }
            });

            return NextResponse.json({
                status: true,
                message: `Slider has been created successfully`
            });
        

    } catch (error) {
        return NextResponse.json({
            status: false,
            error,
            message: 'Something went wrong !'
        });
    }
}

export const PATCH = async (req: Request) => {
    const { id, image, description }: IPatch = await req.json();

    try {
        await prisma.slider.update({
            where: {
                id
            },
            data: {
                image,
                description
            }
        });

        return NextResponse.json({
            message: `Slider has been update successfully`,
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
            await prisma.slider.deleteMany({
                where: {
                    id: {
                        in: id,
                    }
                }
            })
            return NextResponse.json({
                message: "Sliders Delete has been successfully",
                status: true
            });
        }
        else {
            await prisma.slider.delete({
                where: {
                    id: id[0],
                }
            })
            return NextResponse.json({
                message: "Slider Delete has been successfully",
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
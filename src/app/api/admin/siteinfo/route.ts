import { ISiteInfoType } from "@/types/common";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";


interface IUpdate extends IRequest {
    id: number,
}

interface IRequest {
    logo: string | null;
    title: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    description: string | null;
}


export const GET = async (request: Request) => {
    try {
        const siteInfo: ISiteInfoType | null = await prisma.siteInfo.findFirst();
        return NextResponse.json(siteInfo);
    } catch (error) {
        return NextResponse.json({
            status: false,
            error,
            message: 'Something went wrong !'
        });
    }
}


export const PUT = async (req: Request) => {

    const { id, title, logo, email, phone, address, description }: IUpdate = await req.json();


    if (id) {
        try {
            await prisma.siteInfo.update({
                where: {
                    id
                },
                data: {
                    logo,
                    title,
                    email,
                    phone,
                    address,
                    description
                }
            });

            return NextResponse.json({
                message: `Site info has been update successfully`,
                status: true
            });

        } catch (error: any) {
            console.log(error);

            if (error.code == 'P2002') {
                return NextResponse.json({
                    message: "Try again",
                    status: false
                });
            }
            return NextResponse.json({
                message: "Something went wrong",
                status: true
            });
        }
    }
    else {
        try {

            await prisma.siteInfo.create({
                data: {
                    logo,
                    title,
                    email,
                    phone,
                    address,
                    description
                }
            });

            return NextResponse.json({
                status: true,
                message: `Site info has been created successfully`
            });


        } catch (error) {
            return NextResponse.json({
                status: false,
                error,
                message: 'Something went wrong !'
            });
        }
    }
};


import { ISubBlogs } from "@/types/common";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import slugify from "slugify";

interface ISubBLogs extends IRequest {
    id: number,
    slug: string,
}

interface IUpdate extends IRequest {
    id: number,
}

interface IRequest {
    title: string,
}


export const GET = async (request: Request) => {
    try {
        const subBlogs: ISubBlogs[] = await prisma.subBLog.findMany();
        return NextResponse.json(subBlogs);
    } catch (error) {
        return NextResponse.json({
            status: false,
            error,
            message: 'Something went wrong !'
        });
    }
}

export const POST = async (request: Request) => {

    const { title }: IRequest = await request.json();

    try {
        const exist: ISubBLogs | null = await prisma.subBLog.findFirst({
            where: { title }
        });

        if (exist) {
            return NextResponse.json({
                status: false,
                message: `${title} already exist. Try again!`
            })
        }
        else {
            await prisma.subBLog.create({
                data: {
                    title,
                    slug: slugify(title),
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
    const { id, title }: IUpdate = await req.json();

    try {
        await prisma.subBLog.update({
            where: {
                id
            },
            data: {
                title,
                slug: slugify(title),
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
            await prisma.subBLog.deleteMany({
                where: {
                    id: {
                        in: id,
                    }
                }
            })
            return NextResponse.json({
                message: "SubBlogs Delete has been successfully",
                status: true
            });
        }
        else {
            await prisma.subBLog.delete({
                where: {
                    id: id[0],
                }
            })
            return NextResponse.json({
                message: "SubBlog Delete has been successfully",
                status: true
            });
        }

    } catch (error: any) {

        if (error.code === 'P2003') {
            return NextResponse.json({
                message: "Don't delete this sub blog",
                status: false
            })
        }
        else {
            return NextResponse.json({
                message: "Something went wrong",
                error,
                status: false
            })
        }
    }
}
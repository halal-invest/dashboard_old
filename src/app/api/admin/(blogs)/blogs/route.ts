import { IBlogs, IBlogsInclude } from "@/types/common";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import slugify from "slugify";

interface IRequest {
    title: string;
    image?: string;
    author: string;
    content: string;
    subBLogId?: number;
}


export const GET = async (request: Request) => {
    try {
        const blogs:any = await prisma.blog.findMany({
            include: {
                subBLog: true
            }
        });
        return NextResponse.json(blogs);
    } catch (error) {
        return NextResponse.json({
            status: false,
            error,
            message: 'Something went wrong !'
        });
    }
}

export const POST = async (request: Request) => {

    const { title, image, author, content, subBLogId }: IRequest = await request.json();

    try {
        const exist: any= await prisma.blog.findFirst({
            where: { title }
        });

        if (exist) {
            return NextResponse.json({
                status: false,
                message: `${title} already exist. Try again!`
            })
        }
        else {
            await prisma.blog.create({
                data: {
                    title,
                    slug: slugify(title),
                    image,
                    author,
                    content,
                    subBLogId
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
    const { id, title, image, author, content, subBLogId }: IBlogs = await req.json();

    try {
        await prisma.blog.update({
            where: {
                id
            },
            data: {
                title,
                slug: slugify(title),
                image,
                author,
                content,
                subBLogId
            }
        });

        return NextResponse.json({
            message: `${title} has been update successfully`,
            status: true
        });

    } catch (error: any) {
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
};

export const DELETE = async (req: Request) => {

    const { id }: { id: number[] } = await req.json();

    try {

        if (id.length > 1) {
            await prisma.blog.deleteMany({
                where: {
                    id: {
                        in: id,
                    }
                }
            })
            return NextResponse.json({
                message: "Blogs Delete has been successfully",
                status: true
            });
        }
        else {
            await prisma.blog.delete({
                where: {
                    id: id[0],
                }
            })
            return NextResponse.json({
                message: "Blog Delete has been successfully",
                status: true
            });
        }

    } catch (error: any) {

        if (error.code === 'P2003') {
            return NextResponse.json({
                message: "Don't delete this blog",
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
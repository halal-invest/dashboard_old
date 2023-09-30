import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

interface IBlog {
    id: number;
    title: string;
    slug: string;
    image: string | null;
    author: string;
    content: string;
    subBLogId: number | null;
}

export const GET = async (request: Request, { params }: { params: { slug: string } }) => {

    try {
        const blogs: IBlog[] | null = await prisma.blog.findMany({
            where: {
                subBLog: {
                    slug: params.slug
                }
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
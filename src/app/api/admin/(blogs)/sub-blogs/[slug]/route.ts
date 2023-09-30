import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

interface ISubBlog {
    id: number;
    title: string;
    slug: string;
}

export const GET = async (request: Request, { params }: { params: { slug: string } }) => {


    try {
        const subBlog: ISubBlog | null = await prisma.subBLog.findFirst({
            where: {
                slug: params.slug,
            }
        });
        return NextResponse.json(subBlog);
    } catch (error) {
        return NextResponse.json({
            status: false,
            error,
            message: 'Something went wrong !'
        });
    }
}
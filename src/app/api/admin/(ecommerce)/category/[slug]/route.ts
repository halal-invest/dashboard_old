import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

interface ICategory {
    id: number,
    title: string,
    slug: string,
    image: string
}

export const GET = async (request: Request, { params }: { params: { slug: string } }) => {


    try {
        const category: ICategory | null = await prisma.category.findFirst({
            where: {
                slug: params.slug,
            }
        });
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({
            status: false,
            error,
            message: 'Something went wrong !'
        });
    }
}
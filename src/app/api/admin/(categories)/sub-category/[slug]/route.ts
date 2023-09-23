import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

interface ISubCategory {
    id: number,
    title: string,
    slug: string,
    image: string
}

export const GET = async (request: Request, { params }: { params: { slug: string } }) => {

    try {
        const subCategories: ISubCategory[] = await prisma.subCategory.findMany({
            where: {
                category: {
                    slug: params.slug,
                }
            }
        });
        return NextResponse.json(subCategories);
    } catch (error) {
        return NextResponse.json({
            status: false,
            error,
            message: 'Something went wrong !'
        });
    }
}
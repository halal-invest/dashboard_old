import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import slugify from "slugify";

interface ICategory extends IRequest {
    id: number,
    slug: string,
}

interface IUpdate extends IRequest {
    id: number,
}

interface IRequest {
    title: string,
    image: string
}


export const GET = async (request: Request) => {
    try {
        const categories: ICategory[] = await prisma.category.findMany();
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({
            status: false,
            error,
            message: 'Something went wrong !'
        });
    }
}

export const POST = async (request: Request) => {

    const { title, image }: IRequest = await request.json();

    try {
        const exist: ICategory | null = await prisma.category.findFirst({
            where: { title }
        });

        if (exist) {
            return NextResponse.json({
                status: false,
                message: `${title} already exist. Try again!`
            })
        }
        else {
            await prisma.category.create({
                data: {
                    title,
                    slug: slugify(title),
                    image
                }
            });

            return NextResponse.json({
                status: true,
                message: `Category ${title} has been created successfully`
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
    const { id, title, image }: IUpdate = await req.json();

    try {
        await prisma.category.update({
            where: {
                id
            },
            data: {
                title,
                slug: slugify(title),
                image
            }
        });

        return NextResponse.json({
            message: `Category ${title} has been update successfully`,
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
            await prisma.category.deleteMany({
                where: {
                    id: {
                        in: id,
                    }
                }
            })
            return NextResponse.json({
                message: "Categories Delete has been successfully",
                status: true
            });
        }
        else {
            await prisma.category.delete({
                where: {
                    id: id[0],
                }
            })
            return NextResponse.json({
                message: "Category Delete has been successfully",
                status: true
            });
        }

    } catch (error: any) {

        if (error.code === 'P2003') {
            return NextResponse.json({
                message: "Child value has existed, don't delete this category",
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
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import slugify from "slugify";

interface ISubCategory extends IRequest {
    id: number,
    slug: string,

}
interface IUpdate extends IRequest {
    id: number,
}


interface IRequest {
    title: string,
    image: string,
    categoryId: number
}


export const GET = async (request: Request) => {
    try {
        const subCategories: ISubCategory[] = await prisma.subCategory.findMany({
            include: {
                category: true
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

export const POST = async (request: Request) => {

    const { title, image, categoryId }: IRequest = await request.json();

    try {
        const exist: ISubCategory | null = await prisma.subCategory.findFirst({
            where: {
                category: {
                    id: categoryId
                },
                title
            }
        });

        if (exist) {
            return NextResponse.json({
                status: false,
                message: `${title} already exist. Try again!`
            })
        }
        else {
            await prisma.subCategory.create({
                data: {
                    title,
                    slug: slugify(title),
                    image,
                    categoryId
                }
            });

            return NextResponse.json({
                status: true,
                message: `Sub Category ${title} has been created successfully`
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
    const { id, title, image, categoryId }: IUpdate = await req.json();

    try {
        await prisma.subCategory.update({
            where: {
                id
            },
            data: {
                title,
                slug: slugify(title),
                image,
                categoryId
            }
        });

        return NextResponse.json({
            message: `Sub Category ${title} has been update successfully`,
            status: true
        });

    } catch (error) {
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
            await prisma.subCategory.deleteMany({
                where: {
                    id: {
                        in: id,
                    }
                }
            })
            return NextResponse.json({
                message: "Sub Categories Delete has been successfully",
                status: true
            });
        }
        else {
            await prisma.subCategory.delete({
                where: {
                    id: id[0],
                }
            })
            return NextResponse.json({
                message: "Sub Category Delete has been successfully",
                status: true
            });
        }

    } catch (error: any) {
        if (error.code === 'P2003') {
            return NextResponse.json({
                message: "Child value has existed, don't delete this sub category",
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
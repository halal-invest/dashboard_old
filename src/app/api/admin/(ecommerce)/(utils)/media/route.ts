import { checkPermission } from '@/utils/checkPermissions';
import prisma from '@/utils/connect';
import { NextRequest, NextResponse } from 'next/server';

interface Media {
    id: number;
    title: string;
    url: string;
    sizeProductId?: number | null;
    categoryId?: number | null;
    subCategoryId?: number | null;
    subSubCategoryId?: number | null;
}

export const GET = async (request: NextRequest) => {
    const requiredPermission = 'medias';

    if (await checkPermission(request, requiredPermission)) {
        try {
            const medias: Media[] = await prisma.media.findMany();
            return NextResponse.json(medias);
        } catch (error) {
            return NextResponse.json({
                status: false,
                error,
                message: 'Something went wrong !'
            });
        }
    } else {
        return NextResponse.json(null, { status: 200 });
    }
};

export const POST = async (request: NextRequest) => {
    let { title, url, categoryId, subCategoryId, subSubCategoryId , sizeProductId}: Media = await request.json();

    const requiredPermission = 'medias';

    if (await checkPermission(request, requiredPermission)) {
        try {
            if (categoryId != null) {
                await prisma.media.create({
                    data: {
                        title,
                        url,
                        category: {
                            connect: { id: categoryId }
                        }
                    }
                });
            }
            if (subCategoryId != null) {
                await prisma.media.create({
                    data: {
                        title,
                        url,
                        subCategory: {
                            connect: { id: subCategoryId }
                        }
                    }
                });
            }
            if (subSubCategoryId != null) {
                await prisma.media.create({
                    data: {
                        title,
                        url,
                        subSubCategory: {
                            connect: { id: subSubCategoryId }
                        }
                    }
                });
            }
            if (sizeProductId != null) {
                await prisma.media.create({
                    data: {
                        title,
                        url,
                        sizeProduct: {
                            connect: { id: sizeProductId }
                        }
                    }
                });
            }

            return NextResponse.json({
                status: true,
                message: `Media ${title} has been created successfully`
            });
        } catch (error) {
            return NextResponse.json({
                status: false,
                error,
                message: 'Something went wrong !'
            });
        }
    } else {
        return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });
    }
};

export const PATCH = async (request: NextRequest) => {
    let { id, title }: Media = await request.json();
    const requiredPermission = 'medias';

    if (await checkPermission(request, requiredPermission)) {
        try {
            await prisma.media.update({
                where: {
                    id
                },
                data: {
                    title
                }
            });

            return NextResponse.json({
                message: `Media ${title} has been update successfully`,
                status: true
            });
        } catch (error: any) {
            if (error.code == 'P2002') {
                return NextResponse.json({
                    message: 'Same title already exist. Try again',
                    status: false
                });
            }
            return NextResponse.json({
                message: 'Something went wrong',
                status: true
            });
        }
    } else {
        return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });
    }
};

export const DELETE = async (request: NextRequest) => {
    const { id }: { id: number[] } = await request.json();
    const requiredPermission = 'medias';

    if (await checkPermission(request, requiredPermission)) {
        try {
            if (id.length > 1) {
                await prisma.media.deleteMany({
                    where: {
                        id: {
                            in: id
                        }
                    }
                });
                return NextResponse.json({
                    message: 'Medias Delete has been successfully',
                    status: true
                });
            } else {
                await prisma.media.delete({
                    where: {
                        id: id[0]
                    }
                });
                return NextResponse.json({
                    message: 'Media Delete has been successfully',
                    status: true
                });
            }
        } catch (error: any) {
            if (error.code === 'P2003') {
                return NextResponse.json({
                    message: "Child value has existed, don't delete this media",
                    status: false
                });
            } else {
                return NextResponse.json({
                    message: 'Something went wrong',
                    error,
                    status: false
                });
            }
        }
    } else {
        return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });
    }
};

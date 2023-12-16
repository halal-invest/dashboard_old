import prisma from "@/utils/connect";

export async function getCreateSubCategory() {
    const data = await prisma.subCategory.findMany({
        select: {
            id: true,
            title: true,
        }
    })
    return data;
}


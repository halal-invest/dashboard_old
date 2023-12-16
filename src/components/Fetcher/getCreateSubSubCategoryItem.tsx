import prisma from "@/utils/connect";

export async function getCreateSubSubCategory() {
    const data = await prisma.subSubCategory.findMany({
        select: {
            id: true,
            title: true,
        }
    })
    return data;
}


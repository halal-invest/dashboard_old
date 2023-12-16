import prisma from "@/utils/connect"

export async function getCreateCategory() {
    const data = await prisma.category.findMany({
        select: {
            id: true,
            title: true,
        }
    })
    return data;
}


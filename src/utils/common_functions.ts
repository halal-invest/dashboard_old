import prisma from './connect';

export const getUserEmail = async (user_id: number) => {
    const user = await prisma.users.findFirst({
        where: {
            id: user_id
        }
    });
    return user?.email;
};

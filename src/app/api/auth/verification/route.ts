import { NextResponse } from 'next/server';
import prisma from '../../../../utils/connect';
import { hash, compare } from 'bcrypt';
import jwt, { decode, verify } from 'jsonwebtoken';
import { JWT_JOIN_SECRET, JWT_SECRET } from '../../../../utils/constants';

type TokenData = {
    email: string;
    roles: string[];
    projects: string[];
    iat: number;
    exp: number;
};

export const POST = async (request: Request) => {
    const { email, token } = await request.json();
    let emailFromToken = '';
    try {
        if (token) {
            const verified = verify(token, JWT_JOIN_SECRET);

            const decodedToken = decode(token);
            if (decodedToken && typeof decodedToken === 'object' && 'email' in decodedToken) {
                const tokenData: TokenData = decodedToken as TokenData;
                emailFromToken = tokenData?.email;
                if (email !== emailFromToken) {
                    return NextResponse.json({ message: 'Invitation sent with a different email address.', status: false });
                }
                const existUser = await prisma.user.findUnique({
                    where: { email }
                });
                if (!existUser) {
                    return NextResponse.json({ message: 'This email is not registered yet. Please register first.', status: false });
                }
                
                const verifyUser = await prisma.user.update({
                    where: {
                        email: email
                    },
                    data: {
                        verified: true
                    },
                    select: {
                        id:true
                    }
                });
                if(verifyUser){
                    let customerRole = await prisma.role.findFirst({
                        where: {
                            title: 'customer'
                        },
                        select: {
                            id: true
                        }
                    });
                    const userProfile = await prisma.profile.create({
                    data:{
                        email: email,
                        user: {
                            connect:{id:verifyUser?.id}
                        },
                        roles: {
                            connect: [{ id: customerRole?.id }]
                        }
                        
                    }
                })
            }
                if (!verifyUser) {
                    return NextResponse.json({ message: 'Verification Failed. Something went wrong.', status: false });
                }

                return NextResponse.json({ message: 'Verified Successfully', status: true });
            }
        } else {
            return NextResponse.json({ message: 'No token submitted.', status: false });
        }
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ message: error?.message, status: false, msg: 'catch error' });
    }
};

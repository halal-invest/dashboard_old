import { NextResponse } from 'next/server';
import prisma from '../../../../utils/connect';
import jwt, { decode, verify } from 'jsonwebtoken';
import { serialize } from 'cookie';
import { JWT_JOIN_SECRET, JWT_SECRET } from '../../../../utils/constants';
const MAX_AGE = 60 * 60 * 24 *30;
import { cookies } from 'next/headers'
type TokenData = {
    phone: string;
    randomNumber: string;
    roles: string[];
    projects: string[];
    iat: number;
    exp: number;
};

export const POST = async (request: Request) => {
    const { phone, number, token } = await request.json();
    let phoneFromToken = '';
    let numberFromToken = '';
    try {
        if (token) {
            const verified = verify(token, JWT_SECRET);

            const decodedToken = decode(token);
            if (decodedToken && typeof decodedToken === 'object' && 'phone' in decodedToken) {
                const tokenData: TokenData = decodedToken as TokenData;
                phoneFromToken = tokenData?.phone;
                numberFromToken = tokenData?.randomNumber;
                console.log(numberFromToken);

                if (phone !== phoneFromToken) {
                    return NextResponse.json({ message: 'Invalid Request.', status: false });
                }
                if (number !== numberFromToken) {
                    return NextResponse.json({ message: 'Verification Code is not Correct', status: false });
                }
                let existUser = await prisma.otpUser.findUnique({
                    where: { phone }
                });
                if (!existUser) {
                    const newOptUser = await prisma.otpUser.create({
                        data: {
                            phone: phone
                        }
                    });
                    existUser = newOptUser;
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
                            phone: phone,
                            optUser: {
                                connect:{id:newOptUser?.id}
                            },
                            roles: {
                                connect: [{ id: customerRole?.id }]
                            }
                            
                        }
                    })
                }
                
                cookies().set({
                    name: 'phone',
                    value: phone,
                    httpOnly: true,
                    path: '/',
                  })
                const token = jwt.sign({ phone }, JWT_SECRET, { expiresIn: MAX_AGE });

                const serialized = serialize('jwt', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                    maxAge: MAX_AGE
                });
 
                const userProfile = await prisma.profile.findFirst({
                    where: { otpUserId: existUser?.id }
                });
         
                return new Response(JSON.stringify({ user: userProfile, message: 'Authenticated', status: true }), {
                    headers: { 'Set-Cookie': serialized },
                    status: 200
                });
            }
        } else {
            return NextResponse.json({ message: 'No token submitted.', status: false });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error?.message, status: false, msg: 'catch error' });
    }
};

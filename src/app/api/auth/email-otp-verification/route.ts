import { NextResponse } from 'next/server';
import prisma from '../../../../utils/connect';
import jwt, { decode, verify } from 'jsonwebtoken';
import { serialize } from 'cookie';
import { IP_ADDRESS_URL, JWT_JOIN_SECRET, JWT_SECRET } from '../../../../utils/constants';
const MAX_AGE = 60 * 60 * 24 *30;
import { cookies } from 'next/headers'
import { get, set } from 'lodash';
import axios from 'axios';
const rateLimit = 3;
const rateLimiter: Record<string, number[]> = {}; // Use Record type to define rateLimiter as an object with string keys and number array values

const rateLimiterMiddleware = (ip: string): boolean => {
    const now = Date.now();
    const windowStart = now - 60 * 1000 * 5;
    const requestTimestamps = get(rateLimiter, ip, []).filter((timestamp: number) => timestamp > windowStart);
    requestTimestamps.push(now);

    set(rateLimiter, ip, requestTimestamps);

    return requestTimestamps.length <= rateLimit;
};
type TokenData = {
    email: string;
    randomNumber: string;
    roles: string[];
    iat: number;
    exp: number;
};

export const POST = async (request: Request) => {
    const { email, code, token } = await request.json();
    let emailFromToken = '';
    let codeFromToken = '';
    try {
        const ipAddress = await axios(IP_ADDRESS_URL);
        const ip = ipAddress.data.userPrivateIpAddress;
        if (ip !== null) {
            if (!rateLimiterMiddleware(ip)) {
                return NextResponse.json({ message: 'Too Many Requests. Try agian after 5 minutes.' });
            }
        }
        if (token) {
            verify(token, JWT_JOIN_SECRET);

            const decodedToken = decode(token);
            if (decodedToken && typeof decodedToken === 'object' && 'email' in decodedToken) {
                const tokenData: TokenData = decodedToken as TokenData;
                emailFromToken = tokenData?.email;
                codeFromToken = tokenData?.randomNumber;
                console.log(code);
                console.log(codeFromToken);

                if (email !== emailFromToken) {
                    return NextResponse.json({ message: 'Invalid Request.', status: false });
                }
                if (code !== codeFromToken) {
                    return NextResponse.json({ message: 'Verification Code is not Correct', status: false });
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
        return NextResponse.json({ message: error?.message, status: false });
    }
};
import { NextResponse } from 'next/server';
import prisma from '../../../../utils/connect';
import jwt, { decode, verify } from 'jsonwebtoken';
import { serialize } from 'cookie';
import { IP_ADDRESS_URL, JWT_JOIN_SECRET, JWT_SECRET, RATE_LIMIT, RATE_LIMIT_TIME, RATE_LIMIT_TIME_MIN } from '../../../../utils/constants';
const MAX_AGE = 60 * 60 * 24 * 30;
import { cookies } from 'next/headers';
import { get, set, update } from 'lodash';
import axios from 'axios';
const rateLimit = RATE_LIMIT;
const rateLimiter: Record<string, number[]> = {}; // Use Record type to define rateLimiter as an object with string keys and number array values

const rateLimiterMiddleware = (ip: string): boolean => {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_TIME;
    const requestTimestamps = get(rateLimiter, ip, []).filter((timestamp: number) => timestamp > windowStart);
    requestTimestamps.push(now);

    set(rateLimiter, ip, requestTimestamps);

    return requestTimestamps.length <= rateLimit;
};
type TokenData = {
    phone: string;
    randomNumber: string;
    roles: string[];
    iat: number;
    exp: number;
};

export const POST = async (request: Request) => {
    const { phone, number, token } = await request.json();
    let phoneFromToken = '';
    let numberFromToken = '';
    try {
        const ipAddress = await axios(IP_ADDRESS_URL);
        const ip = ipAddress.data.userPrivateIpAddress;
        if (ip !== null) {
            if (!rateLimiterMiddleware(ip)) {
                return NextResponse.json({ message: `Too Many Requests. Try again ${RATE_LIMIT_TIME_MIN} after  minutes.`, status: false });
            }
        }
        if (token) {
            verify(token, JWT_SECRET);

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
                let existUser = await prisma.user.findFirst({
                    where: { phone },
                    select: {
                        id: true,
                        phone: true,
                        phone_verified: true,
                        email: true,
                        email_verified: true,
                        name: true,
                        whatsapp: true,
                        address: true,
                        roles: true
                    }
                });
                const update_status = await prisma.user.update({
                    where: { id: existUser?.id },
                    data: {
                        phone_verified: true
                    }
                });

                if (!existUser) {
                    let investorRole = await prisma.role.findFirst({
                        where: {
                            title: 'investor'
                        },
                        select: {
                            id: true
                        }
                    });
                    const newOptUser = await prisma.user.create({
                        data: {
                            phone: phone,
                            roles: {
                                connect: [{ id: investorRole?.id }]
                            },
                            phone_verified: true
                        },
                        select: {
                            id: true,
                            phone: true,
                            phone_verified: true,
                            email: true,
                            email_verified: true,
                            name: true,
                            whatsapp: true,
                            address: true,
                            roles: true
                        }
                    });
                    existUser = newOptUser;

                    const userProfile = await prisma.profile.create({
                        data: {
                            user: {
                                connect: { id: newOptUser?.id }
                            }
                        }
                    });
                }

                cookies().set({
                    name: 'phone',
                    value: phone,
                    httpOnly: true,
                    path: '/'
                });
                const token = jwt.sign({ phone }, JWT_SECRET, { expiresIn: MAX_AGE });

                const serialized = serialize('jwt', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                    maxAge: MAX_AGE
                });

                const userInfo = {
                    id: existUser?.id,
                    name: existUser?.name,
                    whatsapp: existUser?.whatsapp,
                    address: existUser?.address,
                    email: existUser?.email,
                    phone: existUser?.phone,
                    roles: existUser?.roles,
                    email_verified: existUser?.email_verified,
                    phone_verified: existUser?.phone_verified
                };
                return new Response(JSON.stringify({ message: 'Authenticated', user: userInfo, status: true }), {
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

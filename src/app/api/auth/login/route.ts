import { NextResponse } from 'next/server';
import prisma from '../../../../utils/connect';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { IP_ADDRESS_URL, JWT_SECRET, RATE_LIMIT, RATE_LIMIT_TIME, RATE_LIMIT_TIME_MIN, REFRESH_TOKEN_SECRET } from '../../../../utils/constants';
import { cookies } from 'next/headers';
const ACCESS_TOKEN_AGE = 60 * 60 * 24 * 30;
const REFRESH_TOKEN_AGE = 60 * 60 * 24 * 30;

import { string, number, object, ref } from 'yup';
import sanitize from 'sanitize-html';
import { get, set } from 'lodash';
import { NextApiRequest } from 'next';
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
const schema = object().shape({
    email: string().required().email(),
    password: string().required().min(8).max(16)
});

export const POST = async (request: Request, req: NextApiRequest) => {
    const { email, password } = await request.json();
    try {
        const ipAddress = await axios(IP_ADDRESS_URL);
        const ip = ipAddress.data.userPrivateIpAddress;
        if (ip !== null) {
            if (!rateLimiterMiddleware(ip)) {
                return NextResponse.json({ message: `Too Many Requests. Try again ${RATE_LIMIT_TIME_MIN} after  minutes.`, status: false });
            }
        }
        const cleanInput = {
            email: sanitize(email),
            password: sanitize(password)
        };
        await schema.validate(cleanInput);

        const existUser: any = await prisma.user.findFirst({
            where: { email },
            select: {
                password: true,
                email: true
            }
        });

        if (!existUser) {
            return NextResponse.json({ message: 'No user found with this email.', status: false });
        }
        const passwordMatch = await compare(password, existUser?.password);
        if (passwordMatch) {
            cookies().set({
                name: 'email',
                value: email,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/'
            });
            const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_AGE });
            // const refresh_token = jwt.sign({ email }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_AGE });

            // cookies().set({
            //     name: 'refresh_token',
            //     value: refresh_token,
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === 'production',
            //     path: '/',
            //     maxAge: REFRESH_TOKEN_AGE
            // });
            const serialized = serialize('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: ACCESS_TOKEN_AGE
            });
            // const userProfile = await prisma.profile.findFirst({
            //     where: { id: existUser?.id }
            // });
            const userInfo = {
                id: existUser?.id,
                email: existUser?.email,
                roles: existUser?.roles,
                verified: existUser?.email_verified
            }

            return new Response(JSON.stringify({ message: 'login successful',user: userInfo, token: token, status: true }), {
                headers: { 'Set-Cookie': serialized },
                status: 200
            });
        } else {
            return NextResponse.json({ message: 'Password Incorrect.', status: false });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: error, status: 500, msg: 'catch error' });
    }
};

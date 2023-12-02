import { NextResponse } from 'next/server';
import prisma from '../../../../utils/connect';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { JWT_SECRET } from '../../../../utils/constants';
import { cookies } from 'next/headers';
const MAX_AGE = 60 * 60 * 24 * 30;

import { string, number, object } from 'yup';
import sanitize from 'sanitize-html';
import requestIp from 'request-ip';
import { get, set } from 'lodash';
import { NextApiRequest } from 'next';

const rateLimit = 3;
const rateLimiter = {};
const rateLimiterMiddleware = (ip) => {
    const now = Date.now();
    const windowStart = now - 60 * 1000 * 5;
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
        const ip = requestIp.getClientIp(req);
        if (!rateLimiterMiddleware(ip)) {
            return NextResponse.json({ message: 'Too Many Requests. Try agian after 5 minutes.' });
        }
        const cleanInput = {
            email: sanitize(email),
            password: sanitize(password)
        };
        await schema.validate(cleanInput);

        const existUser: any = await prisma.user.findUnique({
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
                path: '/'
            });
            const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: MAX_AGE });

            const serialized = serialize('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: MAX_AGE
            });
            // const userProfile = await prisma.profile.findFirst({
            //     where: { id: existUser?.id }
            // });

            return new Response(JSON.stringify({ message: 'login successful', token: token, status: true }), {
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

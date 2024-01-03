import { NextResponse } from 'next/server';
import { hash, compare } from 'bcrypt';
import jwt, { decode, verify } from 'jsonwebtoken';
import { FORGOT_PASSWORD_TOKEN_SECRET, IP_ADDRESS_URL, RATE_LIMIT, RATE_LIMIT_TIME, RATE_LIMIT_TIME_MIN } from '@/utils/constants';
import { object, string } from 'yup';
import sanitize from 'sanitize-html';
import { get, set } from 'lodash';
import { NextApiRequest } from 'next';
import axios from 'axios';
import prisma from '@/utils/connect';

const rateLimit = RATE_LIMIT;
const rateLimiter: Record<string, number[]> = {}; 

const rateLimiterMiddleware = (ip: string): boolean => {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_TIME;
    const requestTimestamps = get(rateLimiter, ip, []).filter((timestamp: number) => timestamp > windowStart);
    requestTimestamps.push(now);

    set(rateLimiter, ip, requestTimestamps);

    return requestTimestamps.length <= rateLimit;
};
type TokenData = {
    email: string;
    roles: string[];
    projects: string[];
    randomNumber: string;
    iat: number;
    exp: number;
};
const schema = object().shape({
    email: string().required().email(),
    password: string().required().min(6).max(16)
});


export const POST = async (request: Request, req:NextApiRequest) => {
    const { email, token,code, password, confirmPassword } = await request.json();

    let emailFromToken = '';
    let codeFromToken = '';

    if (token) {
        try {
            // const ipAddress = await axios(IP_ADDRESS_URL);
            // const ip = ipAddress.data.userPrivateIpAddress;
            // if (ip !== null) {
            //     if (!rateLimiterMiddleware(ip)) {
            //         return NextResponse.json({ message: `Too Many Requests. Try again ${RATE_LIMIT_TIME_MIN} after  minutes.`, status: false });
            //     }
            // }
            const cleanInput = {
                email: sanitize(email),
                password: sanitize(password),
                confirmPassword: sanitize(password)
            };
            await schema.validate(cleanInput);
            verify(token, FORGOT_PASSWORD_TOKEN_SECRET);

            const decodedToken = decode(token);
            if (decodedToken && typeof decodedToken === 'object' && 'email' in decodedToken) {
                const tokenData: TokenData = decodedToken as TokenData;
                emailFromToken = tokenData?.email;
                codeFromToken = tokenData?.randomNumber;

                if (email !== emailFromToken) {
                    return NextResponse.json({ message: 'Reset Password link was sent to a different email address.', status: false });
                }
                if (code !== codeFromToken) {
                    return NextResponse.json({ message: 'Verification Code is not Correct', status: false });
                }
                const existUser = await prisma.user.findFirst({
                    where: { email },
                    select: {
                        id:true,
                    
                    }
                });
                if (!existUser) {
                    return NextResponse.json({ message: 'This email is not registered yet. Please register first.', status: false });
                }
               
                if (password !== confirmPassword) {
                    return NextResponse.json({ message: 'Passwords do not match.', status: false });
                }
                const hashedPassword = await hash(password, 10);

                await prisma.user.update({
                    where: {
                        id: existUser?.id
                    },
                    data: {
                        password: hashedPassword
                    },
                    select: {
                        id: true
                    }
                });

                return NextResponse.json({ message: 'Password Reset Successfully', status: true });
            }
        } catch (error: any) {
            console.log(error);
            return NextResponse.json({ message: error?.message, status: false });
        }
    } else {
        return NextResponse.json({ message: 'No token submitted.', status: false });
    }
};
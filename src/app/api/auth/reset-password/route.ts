import { NextResponse } from 'next/server';
import prisma from '../../../../utils/connect';
import { hash, compare } from 'bcrypt';
import jwt, { decode, verify } from 'jsonwebtoken';
import { FORGOT_PASSWORD_TOKEN_SECRET, IP_ADDRESS_URL, JWT_JOIN_SECRET, JWT_SECRET, RATE_LIMIT, RATE_LIMIT_TIME, RATE_LIMIT_TIME_MIN } from '../../../../utils/constants';
import { object, string } from 'yup';
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
type TokenData = {
    email: string;
    roles: string[];
    projects: string[];
    iat: number;
    exp: number;
};
const schema = object().shape({
    email: string().required().email(),
    password: string().required().min(6).max(16)
});
export const POST = async (request: Request, req:NextApiRequest) => {
    const { email, token, password, confirmPassword } = await request.json();
    let emailFromToken = '';
    if (token) {
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
                password: sanitize(password),
                confirmPassword: sanitize(password)
            };
            await schema.validate(cleanInput);
            verify(token, FORGOT_PASSWORD_TOKEN_SECRET);

            const decodedToken = decode(token);
            if (decodedToken && typeof decodedToken === 'object' && 'email' in decodedToken) {
                const tokenData: TokenData = decodedToken as TokenData;
                emailFromToken = tokenData?.email;
                if (email !== emailFromToken) {
                    return NextResponse.json({ message: 'Reset Password link was sent to a different email address.', status: false });
                }
                const existUser = await prisma.user.findFirst({
                    where: { email }
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

                return NextResponse.json({ message: 'Passsword Reset Successfully', status: true });
            }
        } catch (error: any) {
            console.log(error);
            return NextResponse.json({ message: error?.message, status: false });
        }
    } else {
        return NextResponse.json({ message: 'No token submitted.', status: false });
    }
};

import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../utils/connect';
import { hash } from 'bcrypt';
import { sendEmailWithNodemailer } from '@/utils/emails';
import { JWT_JOIN_SECRET, URL } from '@/utils/constants';
import jwt from 'jsonwebtoken';
const MAX_AGE = 60 * 60 * 24 * 7;

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
    password: string().required().min(6).max(16)
});

export const POST = async (request: NextRequest, req: NextApiRequest) => {
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

        const existUser = await prisma.user.findFirst({
            where: { email },
            select: { verified: true }
        });
        if (existUser?.verified) {
            return NextResponse.json({ message: 'User with this email already exists. Try with a new email.' });
        }

        const token = jwt.sign({ email }, JWT_JOIN_SECRET, { expiresIn: MAX_AGE });
        const verificationLink = `${URL}/auth/join?email=${email}&token=${token}`;
        const emailData = {
            from: `${process.env.EMAIL_USER}`,
            to: email,
            subject: 'Verification Link.',
            html: `
                          <h3>Greetings! Please verify you email to join .... </h3>
                          <a href="${verificationLink}"style="display: inline-block; padding: 10px 20px; background-color: green; 
                          color: #fff; text-decoration: none; border: 1px solid black; border-radius: 5px;" >Click to Join </a>
                          <p>This invitation will expire in 7 days.</p>
                          <hr />
                      `
        };
        sendEmailWithNodemailer(emailData);
        const hashedPassword = await hash(password, 10);
        if (!existUser) {
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    verified: false
                }
            });
        }
        return NextResponse.json({ token: token, message: 'Verification Link sent to your Email. Waiting for Verification.' });
    } catch (error: any) {
        return NextResponse.json({ message: error, status: 500 });
    }
};

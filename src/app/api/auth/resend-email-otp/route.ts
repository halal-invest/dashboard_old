import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../utils/connect';
import { hash } from 'bcrypt';
import { sendEmailWithNodemailer } from '@/utils/emails';
import { IP_ADDRESS_URL, JWT_JOIN_SECRET, RATE_LIMIT, RATE_LIMIT_TIME, RATE_LIMIT_TIME_MIN, URL } from '@/utils/constants';
import jwt from 'jsonwebtoken';
const MAX_AGE = 60 * 60 * 24 * 7;

import { string, number, object } from 'yup';
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
    // password: string().required().min(6).max(16)
});

export const POST = async (request: NextRequest, req: NextApiRequest) => {
    const { email } = await request.json();
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
        };
        await schema.validate(cleanInput);

        const existUser = await prisma.users.findFirst({
            where: { email },
            select: { email_verified: true }
        });
        if (existUser?.email_verified) {
            return NextResponse.json({ message: 'User with this email already exists. Try with a new email.' });
        }
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        const token = jwt.sign({ email, randomNumber }, JWT_JOIN_SECRET, { expiresIn: MAX_AGE });
        // const verificationLink = `${URL}/auth/join?email=${email}&token=${token}`;
        const emailData = {
            from: `${process.env.EMAIL_USER}`,
            to: email,
            subject: 'Verification Number.',
            html: `
                          <h4>Greetings! Please enter the code to verify your email. </h4>
                          <h3>${randomNumber}</h3>
                          <p>This code will expire in 7 days.</p>
                          <hr />
                      `
        };
        sendEmailWithNodemailer(emailData);
        // const hashedPassword = await hash(password, 10);
        // if (!existUser) {
        //     const newUser = await prisma.user.create({
        //         data: {
        //             email,
        //             password: hashedPassword,
        //             verified: false
        //         }
        //     });
        // }
        return NextResponse.json({ token: token, otp: randomNumber, message: 'Verification Code sent to your Email. Waiting for Verification.' });
    } catch (error: any) {
        return NextResponse.json({ message: error, status: 500 });
    }
};

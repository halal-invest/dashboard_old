import { NextResponse } from 'next/server';
import prisma from '@/utils/connect';
import jwt from 'jsonwebtoken';
import { FORGOT_PASSWORD_TOKEN_SECRET, IP_ADDRESS_URL, JWT_SECRET, RATE_LIMIT, RATE_LIMIT_TIME_MIN, URL } from '@/utils/constants';
import { sendEmailWithNodemailer } from '@/utils/emails';
import { object, string } from 'yup';
import sanitize from 'sanitize-html';
const MAX_AGE = 60 * 60*24*7;
import { get, set } from 'lodash';
import { NextApiRequest } from 'next';
import axios from 'axios';

const rateLimit = RATE_LIMIT;
const rateLimiter: Record<string, number[]> = {}; // Use Record type to define rateLimiter as an object with string keys and number array values

const rateLimiterMiddleware = (ip: string): boolean => {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_TIME_MIN;
    const requestTimestamps = get(rateLimiter, ip, []).filter((timestamp: number) => timestamp > windowStart);
    requestTimestamps.push(now);

    set(rateLimiter, ip, requestTimestamps);

    return requestTimestamps.length <= rateLimit;
};
const schema = object().shape({
    email: string().required().email()
});

export const POST = async (request: Request, req: NextApiRequest) => {
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
            email: sanitize(email)
        };
        await schema.validate(cleanInput);
        const existUser: any = await prisma.user.findFirst({
            where: { email },
            select: {
                password: true,
                email: true,
                id:true
            }
        });

        if (!existUser) {
            return NextResponse.json({ message: 'No user found with this email.', status: false });
        }
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        const token = jwt.sign({ email, randomNumber }, FORGOT_PASSWORD_TOKEN_SECRET, { expiresIn: MAX_AGE });

        // const resetPasswordLink = `${URL}/auth/reset-password?email=${email}&token=${token}`;
        const emailData = {
            from: `${process.env.EMAIL_USER}`,
            to: email,
            subject: 'RESET PASSWORD VERIFICATION CODE',
            html: `
                          <h3>Enter verification code sent to your email to reset your password. </h3>
                          <a href="${randomNumber}"style="display: inline-block; padding: 10px 20px; background-color: green; 
                          color: #fff; text-decoration: none; border: 1px solid black; border-radius: 5px;" >Click to Join </a>
                          <p>This code will expire in 24 hours.</p>
                          <hr />
                      `
        };
        sendEmailWithNodemailer(emailData);
        return NextResponse.json({ message: 'reset password verification code sent successfully', token: token, code: randomNumber, status: true });
    } catch (error: any) {
        return NextResponse.json({ message: error.message, status: false});
    }
};

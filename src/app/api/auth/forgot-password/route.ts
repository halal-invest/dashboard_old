import { NextResponse } from 'next/server';
import prisma from '../../../../utils/connect';
import jwt from 'jsonwebtoken';
import { FORGOT_PASSWORD_TOKEN_SECRET, IP_ADDRESS_URL, JWT_SECRET, URL } from '../../../../utils/constants';
import { sendEmailWithNodemailer } from '@/utils/emails';
import { object, string } from 'yup';
import sanitize from 'sanitize-html';
const MAX_AGE = 60 * 60;
import { get, set } from 'lodash';
import { NextApiRequest } from 'next';
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
const schema = object().shape({
    email: string().required().email()
});

export const POST = async (request: Request, req: NextApiRequest) => {
    const { email } = await request.json();
    try {
        const ipAddress = await axios(IP_ADDRESS_URL);
        const ip = ipAddress.data.userPrivateIpAddress;
        if (ip !== null) {
            if (!rateLimiterMiddleware(ip)) {
                return NextResponse.json({ message: 'Too Many Requests. Try agian after 5 minutes.' });
            }
        }
        const cleanInput = {
            email: sanitize(email)
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

        const token = jwt.sign({ email }, FORGOT_PASSWORD_TOKEN_SECRET, { expiresIn: MAX_AGE });

        const resetPasswordLink = `${URL}/auth/reset-password?email=${email}&token=${token}`;
        const emailData = {
            from: `${process.env.EMAIL_USER}`,
            to: email,
            subject: 'RESET PASSWORD LINK',
            html: `
                          <h3>Go to the link to reset your password. </h3>
                          <a href="${resetPasswordLink}"style="display: inline-block; padding: 10px 20px; background-color: green; 
                          color: #fff; text-decoration: none; border: 1px solid black; border-radius: 5px;" >Click to Join </a>
                          <p>This link will expire in 24 hours.</p>
                          <hr />
                      `
        };
        sendEmailWithNodemailer(emailData);

        return new Response(JSON.stringify({ message: 'reset password link sent successfully', token: token, status: true }));
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, msg: 'catch error' });
    }
};

import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../utils/connect';
import { hash } from 'bcrypt';
import { sendEmailWithNodemailer } from '@/utils/emails';
import { JWT_JOIN_SECRET } from '@/utils/constants';
import jwt from 'jsonwebtoken';
const MAX_AGE = 60 * 60 * 24 * 7;
export const POST = async (request: NextRequest) => {
    const { email, password } = await request.json();
    function validatePassword(password: string) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
        return passwordRegex.test(password);
    }
    try {
        const existUser = await prisma.user.findFirst({
            where: { email },
            select: { verified: true }
        });
        if (existUser?.verified) {
            return NextResponse.json({ message: 'User with this email already exists. Try with a new email.' });
        }
        if (!validatePassword(password)) {
            return NextResponse.json({ message: 'Password should be at least 6 characters long, contains at least one capital letter and at least one number', status: false });
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
                    verified: false,
                }
            });
        }
        return NextResponse.json({ token: token, message: 'Verification Link sent to your Email. Waiting for Verification.' });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500 });
    }
};

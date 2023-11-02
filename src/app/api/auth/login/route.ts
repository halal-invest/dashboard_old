import { NextResponse } from 'next/server';
import prisma from '../../../../utils/connect';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { JWT_SECRET } from '../../../../utils/constants';
import { cookies } from 'next/headers'
const MAX_AGE = 60 * 60 * 24 * 30;
export const POST = async (request: Request) => {
    const { email, password } = await request.json();
    try {
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
                path: '/',
              })
            const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: MAX_AGE });

            const serialized = serialize('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: MAX_AGE
            });
            const userProfile = await prisma.profile.findFirst({
                where: { id: existUser?.id }
            });

            return new Response(JSON.stringify({ user: userProfile, message: 'Authenticated', status: true }), {
                headers: { 'Set-Cookie': serialized },
                status: 200
            });
        } else {
            return NextResponse.json({ message: 'Password Incorrect.', status: false });
        }
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, msg: 'catch error' });
    }
};

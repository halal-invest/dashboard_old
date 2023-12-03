import { NextResponse } from 'next/server';
import prisma from '../../../../utils/connect';
import { hash, compare } from 'bcrypt';
import jwt, { decode, verify } from 'jsonwebtoken';
import { FORGOT_PASSWORD_TOKEN_SECRET, JWT_JOIN_SECRET, JWT_SECRET } from '../../../../utils/constants';

type TokenData = {
    email: string;
    roles: string[];
    projects: string[];
    iat: number;
    exp: number;
};

export const POST = async (request: Request) => {
    const { email, token, password, confirmPassword } = await request.json();
    let emailFromToken = '';
    if (token) {
        try {
            const verified = verify(token, FORGOT_PASSWORD_TOKEN_SECRET);

            const decodedToken = decode(token);
            if (decodedToken && typeof decodedToken === 'object' && 'email' in decodedToken) {
                const tokenData: TokenData = decodedToken as TokenData;
                emailFromToken = tokenData?.email;
                if (email !== emailFromToken) {
                    return NextResponse.json({ message: 'Reset Password link was sent to a different email address.', status: false });
                }
                const existUser = await prisma.user.findUnique({
                    where: { email }
                });
                if (!existUser) {
                    return NextResponse.json({ message: 'This email is not registered yet. Please register first.', status: false });
                }
                if(password !== confirmPassword){
                    return NextResponse.json({ message: 'Passwords do not match.', status: false });
                    
                }
                const hashedPassword = await hash(password, 10);

                const updatePassword = await prisma.user.update({
                    where: {
                        email: email
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

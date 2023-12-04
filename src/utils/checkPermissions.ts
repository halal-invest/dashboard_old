import { NextRequest, NextResponse } from 'next/server';
import { JWT_SECRET, REFRESH_TOKEN_SECRET } from './constants';
import { decode, verify } from 'jsonwebtoken';
import prisma from './connect';
type TokenData = {
    email: string;
    uniquePermissionsArray: string[];
    iat: number;
    exp: number;
};
export const checkPermission = async (request: NextRequest, requiredPermission: string) => {
    const token = request.cookies.get('jwt');
    let email: any = request.cookies.get('email')?.value;
    let phone: any = request.cookies.get('phone')?.value;
    if (!token) {
        return NextResponse.json({ message: 'Unauthorized', status: 401 });
    }
    try {
        const verified = verify(token?.value, REFRESH_TOKEN_SECRET);
        //email-password users
        if (phone === undefined) {
            const existUser = await prisma.user.findUnique({
                where: { email }
            });
            const existProfile = await prisma.profile.findFirst({
                where: {
                    userId: existUser?.id
                },
                include: {
                    roles: {
                        select: {
                            permissions: {
                                select: {
                                    title: true
                                }
                            }
                        }
                    }
                }
            });
            if (existProfile) {
                const uniquePermissionsSet = new Set();
                existProfile?.roles?.forEach((role) => {
                    role.permissions.forEach((permission) => {
                        uniquePermissionsSet.add(permission.title);
                    });
                });
                const uniquePermissionsArray = Array.from(uniquePermissionsSet);
                if (verified && uniquePermissionsArray.includes(requiredPermission)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            //otp users
            const existUser = await prisma.otpUser.findUnique({
                where: { phone }
            });
            const existProfile = await prisma.profile.findFirst({
                where: {
                    otpUserId: existUser?.id
                },
                include: {
                    roles: {
                        select: {
                            permissions: {
                                select: {
                                    title: true
                                }
                            }
                        }
                    }
                }
            });
            if (existProfile) {
                const uniquePermissionsSet = new Set();
                existProfile?.roles?.forEach((role) => {
                    role.permissions.forEach((permission) => {
                        uniquePermissionsSet.add(permission.title);
                    });
                });
                const uniquePermissionsArray = Array.from(uniquePermissionsSet);
                if (verified && uniquePermissionsArray.includes(requiredPermission)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    } catch (error:any) {
        return false;
    }
};


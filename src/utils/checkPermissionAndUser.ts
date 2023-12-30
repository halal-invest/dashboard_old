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
export const checkPermissionAndUser = async (request: NextRequest, requiredPermission: string, userId: number) => {
    const token = request.cookies.get('jwt');
    let email: any = request.cookies.get('email')?.value;
    let phone: any = request.cookies.get('phone')?.value;
    if (token === undefined) {
        return false;
    }
    try {
        const verified = verify(token?.value, JWT_SECRET);
        //email-password users
        if (phone === undefined) {
            const existUser = await prisma.user.findFirst({
                where: { email },
                select: {
                    roles: {
                        select: {
                            permissions: {
                                select: {
                                    title: true
                                }
                            }
                        }
                    },
                    email_verified: true,
                    id: true
                }
            });

            if (existUser) {
                const uniquePermissionsSet = new Set();
                existUser?.roles?.forEach((role) => {
                    role.permissions.forEach((permission) => {
                        uniquePermissionsSet.add(permission.title);
                    });
                });
                const uniquePermissionsArray = Array.from(uniquePermissionsSet);
                if (verified && existUser?.email_verified && uniquePermissionsArray.includes(requiredPermission) && userId === existUser?.id) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
        if (email === undefined) {
            //otp users
            const existUser = await prisma.user.findFirst({
                where: { phone },
                select: {
                    roles: {
                        select: {
                            permissions: {
                                select: {
                                    title: true
                                }
                            }
                        }
                    },
                    phone_verified: true,
                    id:true
                }
            });

            if (existUser) {
                const uniquePermissionsSet = new Set();
                existUser?.roles?.forEach((role) => {
                    role.permissions.forEach((permission) => {
                        uniquePermissionsSet.add(permission.title);
                    });
                });
                const uniquePermissionsArray = Array.from(uniquePermissionsSet);
                if (verified && existUser?.phone_verified && uniquePermissionsArray.includes(requiredPermission) && userId === existUser?.id) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    } catch (error: any) {
        return false;
    }
};

import { NextRequest } from 'next/server';
import { JWT_SECRET } from './constants';
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
    if (token) {
        const verified = verify(token?.value, JWT_SECRET);
        if (verified) {
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
                    }
                } else {
                    return false;
                }
            } else {
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
                    }
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    }
    return false;
};

export const verifyToken = async (request: NextRequest, token: string) => {
    // const token = request.cookies.get('jwt');
    // let email: string = '';

    const verified = verify(token, JWT_SECRET);
    if (verified) {
        console.log('token verified');
        const decodedToken = decode(token);
        if (decodedToken) {
            console.log('token decoded');
        } else {
            console.log('token not decoded');
        }
    } else {
        console.log('token not verified');
    }
};

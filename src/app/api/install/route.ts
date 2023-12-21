import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/connect';
import { hash } from 'bcrypt';

export const GET = async (request: NextRequest) => {
    try {
        const adminCount = await prisma.user.count({
            where: {
                roles: {
                    some: {
                        title: 'admin'
                    }
                }
            }
        });
        return NextResponse.json({ adminCount, status: true });

    } catch (error) {
        return NextResponse.json({ message: error, status: false });
    }
};

export const POST = async (request: NextRequest) => {
    const { email, password } = await request.json();
    try {
        const adminCount = await prisma.user.count({
            where: {
                roles: {
                    some: {
                        title: 'admin'
                    }
                }
            }
        });
        if(adminCount >=1 ){
        return NextResponse.json({ message: "Admin already exists.Please login", status: 500 });

        }
        const users_managePermission = await prisma.permission.create({
            data: {
                title: "users_manage",
                description: "allow users management"
            }
        })
        const investorPermission = await prisma.permission.create({
            data: {
                title: "investment",
                description: "default permission"
            }
        })

        const adminRole = await prisma.role.create({
            data: {
                title: 'admin',
                description: 'admin',
                permissions: {
                    connect: [{id: users_managePermission.id}]
                }

            }
        })
        const investorRole = await prisma.role.create({
            data: {
                title: 'investor',
                description: 'investor',
                permissions: {
                    connect: [{id: investorPermission.id}]
                }

            }
        })
       

            const hashedPassword = await hash(password, 10);
            const adminUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    roles: {
                        connect: [{id:adminRole.id}]
                    },
                    email_verified:true
                },
                select:{
                    id:true
                }
            });
           
        return NextResponse.json({ message: 'Admin created successfully', status: true });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: error, status: 500 });
    }
};

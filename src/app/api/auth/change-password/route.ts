import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../utils/connect';
import { hash } from 'bcrypt';
import { checkPermission } from '@/utils/checkPermissions';
import { checkPermissionAndUser } from '@/utils/checkPermissionAndUser';

import { string, number, object, ref } from 'yup';
import sanitize from 'sanitize-html';
import { get, set } from 'lodash';
const schema = object().shape({
    password: string().required().min(6).max(16)
});
export const PATCH = async (request: NextRequest) => {
    const { id, password } = await request.json();
    const investor_permission = 'investment';

    let hashedPassword;
    try {
        if (await checkPermissionAndUser(request, investor_permission, id)) {
            const cleanInput = {
                password: sanitize(password)
            };
            await schema.validate(cleanInput);
            hashedPassword = await hash(password, 10);

            await prisma.users.update({
                where: {
                    id: id
                },
                data: {
                    password: hashedPassword
                }
            });

            return NextResponse.json({
                message: `User Password has been updated successfully`,
                status: true
            });
        } else {
            return NextResponse.json({ message: 'You are not allowed to perform this action.', status: false });
        }
    } catch (error:any) {
        return NextResponse.json({ message: error.message, status: false });
    }
};

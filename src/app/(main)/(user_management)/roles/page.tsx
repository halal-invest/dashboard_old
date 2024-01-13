import MainContextRole from '@/components/(user_management)/Roles';
import { getPermissions } from '@/components/Fetcher/getPermissions';
import { getRoles } from '@/components/Fetcher/getRoles';
import React from 'react';

const RolePage = async () => {
    const data = await getRoles();
    const permissions = await getPermissions();
    return (
        <div>
            <MainContextRole roles={data} permissions={permissions} />
        </div>
    );
};

export default RolePage;

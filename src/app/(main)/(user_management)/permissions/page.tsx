import MainContextPermission from '@/components/(user_management)/Permissions';
import { getPermissions } from '@/components/Fetcher/getPermissions';
import React from 'react';

const PermissionPage = async () => {
    const data = await getPermissions();
    return (
        <div>
            <MainContextPermission permissions={data} />
        </div>
    );
};

export default PermissionPage;

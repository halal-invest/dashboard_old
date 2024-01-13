import { getRoles } from '@/components/Fetcher/getRoles';
import { getProfiles } from '@/components/Fetcher/getProfiles';
import React from 'react';
import MainContextUser from '@/components/(user_management)/Users';

const UsersPage = async () => {
    const roles = await getRoles();
    const users = await getProfiles();
    return (
        <div>
            <MainContextUser roles={roles} users={users} />
        </div>
    );
};

export default UsersPage;

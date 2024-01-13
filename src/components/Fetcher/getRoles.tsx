import { URL } from '@/utils/constants';

export async function getRoles() {
    const res = await fetch(`${URL}/api/user_management/roles`, {
        cache: 'no-cache'
    });
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json();
}

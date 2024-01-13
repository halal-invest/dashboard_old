import { URL } from '@/utils/constants';

export async function getProfiles() {
    const res = await fetch(`${URL}/api/user_management/profiles`, {
        cache: 'no-cache'
    });
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json();
}

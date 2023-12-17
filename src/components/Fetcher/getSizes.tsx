import { URL } from "@/utils/constants"

export async function getSizes() {
    const res = await fetch(`${URL}/api/admin/size`, {
        cache: "no-cache"
    });
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return res.json()
}


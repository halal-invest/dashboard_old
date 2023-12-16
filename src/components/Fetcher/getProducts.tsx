import { URL } from "@/utils/constants"

export async function getProducts() {
    const res = await fetch(`${URL}/api/admin/product`, {
        cache: "no-cache"
    });
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return res.json()
}


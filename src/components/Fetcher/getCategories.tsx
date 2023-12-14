import { URL } from "@/utils/constants"

export async function getCategories() {
    const res = await fetch(`${URL}/api/admin/category`, {
        cache: "no-cache"
    })
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return res.json()
}


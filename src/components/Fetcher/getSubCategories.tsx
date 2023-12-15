import { URL } from "@/utils/constants"

export async function getSubCategories() {
    const res = await fetch(`${URL}/api/admin/sub-category`, {
        cache: "no-cache"
    })
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return res.json()
}


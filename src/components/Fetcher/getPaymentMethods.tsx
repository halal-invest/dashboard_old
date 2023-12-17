import { URL } from "@/utils/constants"

export async function getPaymentMethods() {
    const res = await fetch(`${URL}/api/admin/payment-method`, {
        cache: "no-cache"
    })
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return res.json()
}


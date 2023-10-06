"use-client"
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const usePaymentMethod = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['payment-methods'],
        queryFn: async () => await axios.get("/api/admin/payment-method")
    });

    return { data, isLoading, error, refetch };
};

export default usePaymentMethod;
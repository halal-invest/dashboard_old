"use-client"
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useShipping = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['shippings'],
        queryFn: async () => await axios.get("/api/admin/shipping")
    });

    return { data, isLoading, error, refetch };
};

export default useShipping;
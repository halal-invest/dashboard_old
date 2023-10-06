"use-client"
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const useCoupons = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['coupons'],
        queryFn: async () => await axios.get("/api/admin/coupons")
    });

    return { data, isLoading, error, refetch };
};

export default useCoupons;
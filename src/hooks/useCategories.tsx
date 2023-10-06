"use-client"
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const useCategories = () => {
    const { data: categories, isLoading, error, refetch } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => await axios.get("/api/admin/category")
    });
    return { data: categories, isLoading, error, refetch }
};

export default useCategories;
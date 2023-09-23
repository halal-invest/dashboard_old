"use client"
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useCategories = async () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => await axios.get("/api/admin/category")
    });

    return { data, isLoading, error, refetch };
}

export default useCategories;
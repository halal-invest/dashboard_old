"use-client"
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useSubBlogs = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['sub-blogs'],
        queryFn: async () => await axios.get("/api/admin/sub-blogs")
    });

    return { data, isLoading, error, refetch };
};

export default useSubBlogs;
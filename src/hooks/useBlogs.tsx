"use-client"
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useBlogs = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['blogs'],
        queryFn: async () => await axios.get("/api/admin/blogs")
    });

    return { data, isLoading, error, refetch };
};

export default useBlogs;
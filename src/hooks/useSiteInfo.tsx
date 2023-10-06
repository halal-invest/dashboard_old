"use-client"
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useSiteInfo = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['site-info'],
        queryFn: async () => await axios.get("/api/admin/siteinfo")
    });

    return { data, isLoading, error, refetch };
};

export default useSiteInfo;
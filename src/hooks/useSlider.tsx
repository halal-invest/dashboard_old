"use-client"
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useSlider = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['sliders'],
        queryFn: async () => await axios.get("/api/admin/slider")
    });

    return { data, isLoading, error, refetch };
};

export default useSlider;
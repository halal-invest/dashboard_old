"use client"
import { ICategory } from '@/types/common';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import React from 'react';

const ShowSubCategory = ({ selected }: { selected: ICategory[] }) => {

    const router = useRouter();

    const url = `/categories/${selected[0]?.slug}`;

    const handleClick = () => {
        return router.push(url);
    }

    return (
        <Button
            label="Sub Category"
            severity="info"
            raised
            size="small"
            className="mr-2 p-2"
            disabled={selected?.length !== 1}
            onClick={handleClick}
        />
    );
};

export default ShowSubCategory;
"use client"
import {ISubBlogs } from '@/types/common';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import React from 'react';

const ShowBlogs = ({ selected }: { selected: ISubBlogs[] }) => {

    const router = useRouter();

    const url = `/sub-blogs/${selected[0]?.slug}`;

    const handleClick = () => {
        return router.push(url);
    }

    return (
        <Button
            label="Blogs"
            severity="info"
            raised
            size="small"
            className="mr-2 p-2"
            disabled={selected?.length !== 1}
            onClick={handleClick}
        />
    );
};

export default ShowBlogs;
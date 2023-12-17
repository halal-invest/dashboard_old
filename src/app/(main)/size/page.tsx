import MainContextSize from '@/components/(crud)/(Products)/Size';
import { getSizes } from '@/components/Fetcher/getSizes';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'E-commerce || Size',
    description: 'Safefoods - Your Trusted Online Marketplace for Fresh, Quality Ingredients. Explore a world of culinary delights with our diverse selection of safe and premium food products. Shop confidently for a healthier lifestyle at Safefoods!',
}

interface IProps {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}


const SizePage = async ({ searchParams }: IProps) => {
    const sizes = await getSizes();
    const page = searchParams["page"] ?? "1"
    const per_page = searchParams["per_page"] ?? "5"

    const start = (Number(page) - 1) * Number(per_page);
    const end = start + Number(per_page);

    return (
        <div>
            <MainContextSize sizes={sizes} />
        </div>
    );
};

export default SizePage;
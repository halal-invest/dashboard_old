import MainContextCategories from '@/components/(crud)/Category';
import { getCategories } from '@/components/Fetcher/getCategories';
import { Metadata } from 'next';
import React from 'react';


export const metadata: Metadata = {
    title: 'E-commerce || Categories',
    description: 'Safefoods - Your Trusted Online Marketplace for Fresh, Quality Ingredients. Explore a world of culinary delights with our diverse selection of safe and premium food products. Shop confidently for a healthier lifestyle at Safefoods!',
}

const CategoriesPage = async () => {
    const data = await getCategories();
    return (
        <div>
            <MainContextCategories categories={data} />
        </div>
    );
};

export default CategoriesPage;
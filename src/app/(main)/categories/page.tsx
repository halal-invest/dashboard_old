import MainContextCategories from '@/components/(crud)/Category';
import { getCategories } from '@/components/Fetcher/getCategories';
import React from 'react';

const CategoriesPage = async () => {
    const data = await getCategories();
    return (
        <div>
            <MainContextCategories categories={data} />
        </div>
    );
};

export default CategoriesPage;
import MainContextSubCategories from '@/components/(crud)/SubCategory';
import { getCreateCategory } from '@/components/Fetcher/getCreateCategoryItem';
import { getSubCategories } from '@/components/Fetcher/getSubCategories';
import { ICreateCategoryItemType, IGetSubCategoriesItemType } from '@/types/common';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'E-commerce || Sub Categories',
    description: 'Safefoods - Your Trusted Online Marketplace for Fresh, Quality Ingredients. Explore a world of culinary delights with our diverse selection of safe and premium food products. Shop confidently for a healthier lifestyle at Safefoods!',
}

const SubCategoryPage = async () => {

    const data: IGetSubCategoriesItemType[] = await getSubCategories();
    const getCategories: ICreateCategoryItemType[] = await getCreateCategory();

    return (
        <div>
            <MainContextSubCategories subCategories={data} getCategories={getCategories} />
        </div>
    );
};

export default SubCategoryPage;
import MainContextSubSubCategories from '@/components/(crud)/SubSubCategory';
import { getCreateSubCategory } from '@/components/Fetcher/getCreateSubCategoryItem';
import { getSubSubCategories } from '@/components/Fetcher/getSubSubCategories';
import { ICreateSubCategoryItemType, IGetSubSubCategoriesItemsType } from '@/types/common';
import prisma from '@/utils/connect';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'E-commerce || Sub Sub Categories',
    description: 'Safefoods - Your Trusted Online Marketplace for Fresh, Quality Ingredients. Explore a world of culinary delights with our diverse selection of safe and premium food products. Shop confidently for a healthier lifestyle at Safefoods!',
}

const SubSubCategoriesPage = async () => {

    const data: IGetSubSubCategoriesItemsType[] = await getSubSubCategories();
    const getSubCategory: ICreateSubCategoryItemType[] = await getCreateSubCategory();

    return (
        <div>
            <MainContextSubSubCategories subSubCategories={data} subCategories={getSubCategory} />
        </div>
    );
};

export default SubSubCategoriesPage;
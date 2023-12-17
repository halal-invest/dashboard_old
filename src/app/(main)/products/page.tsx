import MainContextProducts from '@/components/(crud)/(Products)/Product';
import { getCreateSubCategory } from '@/components/Fetcher/getCreateSubCategoryItem';
import { getCreateSubSubCategory } from '@/components/Fetcher/getCreateSubSubCategoryItem';
import { getProducts } from '@/components/Fetcher/getProducts';
import { ICreateSubCategoryItemType, IGetProductsItemsTypes } from '@/types/common';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'E-commerce || Products',
    description: 'Safefoods - Your Trusted Online Marketplace for Fresh, Quality Ingredients. Explore a world of culinary delights with our diverse selection of safe and premium food products. Shop confidently for a healthier lifestyle at Safefoods!',
}

const ProductPage = async () => {
    const getSubCategory: ICreateSubCategoryItemType[] = await getCreateSubCategory();
    const getSubSubCategories: ICreateSubCategoryItemType[] = await getCreateSubSubCategory();
    const products: IGetProductsItemsTypes[] = await getProducts()

    return (
        <div>
            <MainContextProducts
                subCategories={getSubCategory}
                subSubCategories={getSubSubCategories}
                products={products}
            />
        </div>
    );
};

export default ProductPage;
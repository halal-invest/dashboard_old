import MainContextProducts from '@/components/(crud)/(Products)/Product';
import { getCreateCategory } from '@/components/Fetcher/getCreateCategoryItem';
import { getCreateSubCategory } from '@/components/Fetcher/getCreateSubCategoryItem';
import { getCreateSubSubCategory } from '@/components/Fetcher/getCreateSubSubCategoryItem';
import { getProducts } from '@/components/Fetcher/getProducts';
import { ICreateCategoryItemType, ICreateSubCategoryItemType, IGetProductsItemsTypes } from '@/types/common';
import React from 'react';

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
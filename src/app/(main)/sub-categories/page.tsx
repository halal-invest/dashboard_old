import MainContextSubCategories from '@/components/(crud)/SubCategory';
import { getCreateCategory } from '@/components/Fetcher/getCreateCategoryItem';
import { getSubCategories } from '@/components/Fetcher/getSubCategories';
import { ICreateCategoryItemType, IGetSubCategoriesItemType } from '@/types/common';
import prisma from '@/utils/connect';
import React from 'react';

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
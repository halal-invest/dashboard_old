import MainContextSubSubCategories from '@/components/(crud)/SubSubCategory';
import { getSubSubCategories } from '@/components/Fetcher/getSubSubCategories';
import { ICreateSubCategoryItemType, IGetSubSubCategoriesItemsType } from '@/types/common';
import prisma from '@/utils/connect';
import React from 'react';

const SubSubCategoriesPage = async () => {

    const data: IGetSubSubCategoriesItemsType[] = await getSubSubCategories();

    const getSubCategory: ICreateSubCategoryItemType[] = await prisma.subCategory.findMany({
        select: {
            id: true,
            title: true,
        }
    })

    return (
        <div>
            <MainContextSubSubCategories subSubCategories={data} subCategories={getSubCategory} />
        </div>
    );
};

export default SubSubCategoriesPage;
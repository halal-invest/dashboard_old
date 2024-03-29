export interface ICategory {
    id: number;
    title: string;
    slug: string;
    image: string;
}

export interface ISubCategory {
    id: number;
    title: string;
    slug: string;
    image: string;
    categoryId: number;
    category?: {
        id: number;
        title: string;
        slug: string;
        image: string;
    };
}

export interface ISubBlogs {
    id: number;
    title: string;
    slug: string;
}

export interface IBlogs {
    id: number;
    title: string;
    slug: string;
    image: string;
    author: string;
    content: string;
    subBLogId: number | null;
}
export interface IBlogsInclude {
    id: number;
    title: string;
    slug: string;
    image: string;
    author: string;
    content: string;
    subBLog: ISubBlogs;
}

export interface ICouponType {
    id: number;
    title: string;
    slug: string;
    discount: number;
    type: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPaymentMethodType {
    id: number;
    title: string;
    description: string;
}

export interface IShippingType {
    id: number;
    title: string;
    cost: number;
    description: string;
}

export interface ISiteInfoType {
    id: number;
    logo: string | null;
    title: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    description: string | null;
}

export interface ISliderType {
    id: number;
    image: string;
    description: string | null;
}

// working....
export interface ICreateCategoryItemType {
    id: number;
    title: string;
}
export interface ICreateSubCategoryItemType {
    id: number;
    title: string;
}

export interface IGetSubCategoriesItemType {
    id: number;
    title: string;
    slug: string;
    media: {
        id: number;
        title: string;
        url: string;
        subCategoryId: number | null;
    } | null;
    category: {
        id: number;
        title: string;
    };
}

export interface IGetSubSubCategoriesItemsType {
    subCategory: {
        id: number;
        title: string;
    };
    media: {
        id: number;
        title: string;
        url: string;
        subSubCategoryId: number | null;
    } | null;
    id: number;
    title: string;
    slug: string;
    subCategoryId: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IGetProductsItemsTypes {
    subSubCategory: {
        id: number;
        title: string;
    } | null;
    subCategory: {
        id: number;
        title: string;
    } | null;
    id: number;
    title: string;
    slug: string;
    sku: string | null;
    season: string | null;
    subSubCategoryId: number | null;
    subCategoryId: number | null;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISizedType {
    id: number;
    title: string;
}
export interface IDeliveryCostType {
    id: number;
    areaName: string;
    cost: string;
}

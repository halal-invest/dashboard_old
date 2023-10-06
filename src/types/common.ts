export interface ICategory {
    id: number,
    title: string,
    slug: string
    image: string,
}

export interface ISubCategory {
    id: number,
    title: string,
    slug: string
    image: string,
    categoryId: number,
    category?: {
        id: number,
        title: string,
        slug: string,
        image: string
    }
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
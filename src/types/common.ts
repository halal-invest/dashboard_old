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
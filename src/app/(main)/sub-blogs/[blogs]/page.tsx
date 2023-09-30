"use client"
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toolbar } from 'primereact/toolbar';
import React, { useRef, useState } from 'react';
import { IBlogsInclude } from '@/types/common';
import TableHeader from '@/components/Common/TableHeader';
import { Image } from 'primereact/image';
import BlogSkeleton from '@/components/Skeleton/BlogSkeleton';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import CreateBlogInPage from '@/components/(crud)/(Blogs)/Blog/CreateBlogInPage';
import DeleteBlog from '@/components/(crud)/(Blogs)/Blog/DeleteBlog';
import UpdateBlog from '@/components/(crud)/(Blogs)/Blog/UpdateBlog';


interface IProps {
    params: {
        blogs: string,
    }
}

const BlogsPages = ({ params }: IProps) => {

    const [selected, setSelected] = useState<IBlogsInclude[]>([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);


    const { data: blogsData, isLoading, error, refetch } = useQuery({
        queryKey: [`filter-blogs, ${params?.blogs}`],
        queryFn: async () => await axios.get(`/api/admin/blogs/${params?.blogs}`)
    });

    const { data: subBlog, } = useQuery({
        queryKey: [`${params?.blogs}`],
        queryFn: async () => await axios.get(`/api/admin/sub-blogs/${params?.blogs}`)
    });


    error && console.log(error);


    const leftToolbarTemplate = () => {
        return (
            <>
                <DeleteBlog
                    refetch={refetch}
                    rowSelected={selected}
                    setRowSelected={setSelected}
                />
                <UpdateBlog
                    refetch={refetch}
                    rowSelected={selected}
                    setRowSelected={setSelected}
                    subBlogData={blogsData}
                />
            </>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <CreateBlogInPage
                    subBlog={subBlog?.data}
                    refetch={refetch}
                />
            </>
        );
    };


    const titleBodyTemplate = (rowData: IBlogsInclude) => {
        return (
            <>
                {rowData?.title?.toUpperCase()}
            </>
        );
    };

    const imageBodyTemplate = (rowData: IBlogsInclude) => {
        return (
            <>
                <div className='flex justify-content-start'>
                    <Image
                        loading='lazy'
                        src={rowData?.image}
                        alt="Image"
                        height='40'
                        width="50"
                        preview />
                </div>
            </>
        );
    };


    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toolbar
                        className="mb-2"
                        right={rightToolbarTemplate}
                        left={leftToolbarTemplate}
                    />
                    {
                        isLoading
                            ?
                            <BlogSkeleton />
                            :
                            <DataTable
                                ref={dt}
                                value={blogsData?.data}
                                selection={selected}
                                onSelectionChange={(e) => setSelected(e.value as any)}
                                dataKey="id"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} blogs"
                                globalFilter={globalFilter}
                                emptyMessage="No Blogs found."
                                header={<TableHeader data={blogsData?.data} setGlobalFilter={setGlobalFilter} title='blogs' />}
                                responsiveLayout="scroll"
                            >
                                <Column
                                    selectionMode="multiple"
                                    headerStyle={{ width: '5rem' }}
                                />
                                <Column
                                    field="image"
                                    header="IMAGE"
                                    sortable
                                    body={imageBodyTemplate}
                                    headerStyle={{ minWidth: "5rem" }}
                                />

                                <Column
                                    field="title"
                                    header="TITLE"
                                    sortable
                                    body={titleBodyTemplate}
                                    headerStyle={{ minWidth: "20rem" }}
                                />

                            </DataTable>
                    }

                </div>
            </div>
        </div>
    );
};

export default BlogsPages;
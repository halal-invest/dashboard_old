"use client"
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toolbar } from 'primereact/toolbar';
import React, { useRef, useState } from 'react';
import { IBlogsInclude } from '@/types/common';
import TableHeader from '@/components/Common/TableHeader';
import CategorySkeleton from '@/components/Skeleton/CategorySkeleton';
import { Image } from 'primereact/image';
import useBlogs from '@/hooks/useBlogs';
import CreateBlog from '@/components/(crud)/(Blogs)/Blog/CreateBlog';
import useSubBlogs from '@/hooks/useSubBlogs';
import DeleteBlog from '@/components/(crud)/(Blogs)/Blog/DeleteBlog';
import UpdateBlog from '@/components/(crud)/(Blogs)/Blog/UpdateBlog';
import BlogSkeleton from '@/components/Skeleton/BlogSkeleton';


const BlogsPages = () => {

    const [selected, setSelected] = useState<IBlogsInclude[]>([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);


    const { data, isLoading, error, refetch } = useBlogs();
    const { data: subBlogData } = useSubBlogs();

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
                    subBlogData={subBlogData}
                />
            </>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <CreateBlog
                    refetch={refetch}
                    subBlogData={subBlogData}
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

    const subBlogBodyTemplate = (rowData: IBlogsInclude) => {
        return (
            <>
                {rowData?.subBLog?.title}
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
                                value={data?.data}
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
                                header={<TableHeader data={data?.data} setGlobalFilter={setGlobalFilter} title='blogs' />}
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

                                <Column
                                    field="subBlog.title"
                                    header="SUB-BLOGS"
                                    sortable
                                    body={subBlogBodyTemplate}
                                    headerStyle={{ minWidth: "10rem" }}
                                />

                            </DataTable>
                    }

                </div>
            </div>
        </div>
    );
};

export default BlogsPages;
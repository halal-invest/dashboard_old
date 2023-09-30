"use client"
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toolbar } from 'primereact/toolbar';
import React, { useRef, useState } from 'react';
import { ISubBlogs } from '@/types/common';
import TableHeader from '@/components/Common/TableHeader';
import CreateSubBlog from '@/components/(crud)/(Blogs)/SubBLog/CreateSubBLog';
import useSubBlogs from '@/hooks/useSubBlogs';
import SubBlogSkeleton from '@/components/Skeleton/SubBlogSkeleton';
import DeleteSubBlog from '@/components/(crud)/(Blogs)/SubBLog/DeleteSubBlog';
import UpdateSubBlog from '@/components/(crud)/(Blogs)/SubBLog/UpdateSubBlog';
import ShowBlogs from '@/components/(crud)/(Blogs)/SubBLog/ShowBlogs';


const SubBlogsPage = () => {

    const [selected, setSelected] = useState<ISubBlogs[] | []>([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);

    const { data, isLoading, error, refetch } = useSubBlogs();



    error && console.log(error);


    const leftToolbarTemplate = () => {
        return (
            <>
                <DeleteSubBlog rowSelected={selected} refetch={refetch} setRowSelected={setSelected} />
                <UpdateSubBlog rowSelected={selected} refetch={refetch} setRowSelected={setSelected} />
            </>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <ShowBlogs selected={selected} />
                <CreateSubBlog refetch={refetch} />
            </>
        );
    };

    const codeBodyTemplate = (rowData: ISubBlogs) => {
        return (
            <>
                {rowData.id}
            </>
        );
    };

    const titleBodyTemplate = (rowData: ISubBlogs) => {
        return (
            <>
                {rowData?.title?.toUpperCase()}
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
                            <SubBlogSkeleton />
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
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} sub blogs"
                                globalFilter={globalFilter}
                                emptyMessage="No Sub Blog found."
                                header={<TableHeader data={data?.data} setGlobalFilter={setGlobalFilter} title='sub blogs ' />}
                                responsiveLayout="scroll"
                            >
                                <Column
                                    selectionMode="multiple"
                                    headerStyle={{ width: '5rem' }}
                                />
                                <Column
                                    field="id"
                                    header="CODE"
                                    sortable body={codeBodyTemplate}
                                    headerStyle={{ minWidth: '5rem' }}
                                />

                                <Column
                                    field="title"
                                    header="TITLE"
                                    sortable
                                    body={titleBodyTemplate}
                                    headerStyle={{ minWidth: "15rem" }}
                                />

                            </DataTable>
                    }

                </div>
            </div>
        </div>
    );
};

export default SubBlogsPage;
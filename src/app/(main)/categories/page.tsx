"use client"
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toolbar } from 'primereact/toolbar';
import React, { useRef, useState } from 'react';
import { ICategory } from '@/types/common';
import CreateCategory from '@/components/(crud)/Category/CreateCategory';
import TableHeader from '@/components/Common/TableHeader';
import CategorySkeleton from '@/components/Skeleton/CategorySkeleton';
import DeleteCategory from '@/components/(crud)/Category/DeleteCategory';
import UpdateCategory from '@/components/(crud)/Category/UpdateCategory';
import ShowSubCategory from '@/components/(crud)/Category/ShowSubCategory';
import { Image } from 'primereact/image';
import useCategories from '@/hooks/useCategories';


const CategoriesPage = () => {

    const [selected, setSelected] = useState<ICategory[] | []>([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);

    const { data: categories, isLoading, error, refetch } = useCategories();

    error && console.log(error);


    const leftToolbarTemplate = () => {
        return (
            <>
                <DeleteCategory rowSelected={selected} refetch={refetch} setRowSelected={setSelected} />
                <UpdateCategory refetch={refetch} rowSelected={selected} setRowSelected={setSelected} />
            </>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <ShowSubCategory selected={selected} />
                <CreateCategory refetch={refetch} />
            </>
        );
    };

    const codeBodyTemplate = (rowData: any) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.id}
            </>
        );
    };

    const titleBodyTemplate = (rowData: any) => {
        return (
            <>
                {rowData?.title?.toUpperCase()}
            </>
        );
    };

    const imageBodyTemplate = (rowData: any) => {
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
                            <CategorySkeleton />
                            :
                            <DataTable
                                ref={dt}
                                value={categories?.data}
                                selection={selected}
                                onSelectionChange={(e) => setSelected(e.value as any)}
                                dataKey="id"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Category"
                                globalFilter={globalFilter}
                                emptyMessage="No Category found."
                                header={<TableHeader data={categories?.data} setGlobalFilter={setGlobalFilter} title='Category' />}
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
                                    headerStyle={{ minWidth: "15rem" }}
                                />

                            </DataTable>
                    }

                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;
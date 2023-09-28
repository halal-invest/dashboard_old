"use client"
import CreateSubCategory from '@/components/(crud)/SubCategory/CreateSubCategory';
import DeleteSubCategory from '@/components/(crud)/SubCategory/DeleteSubCategory';
import UpdateSubCategory from '@/components/(crud)/SubCategory/UpdateSubCategory';
import TableHeader from '@/components/Common/TableHeader';
import SubCategorySkeleton from '@/components/Skeleton/SubCategorySkeleton';
import { ISubCategory } from '@/types/common';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Image } from 'primereact/image';
import { Toolbar } from 'primereact/toolbar';
import React, { useRef, useState } from 'react';

interface IProps {
    params: {
        subcategory: string,
    }
}

const SubCategoryPage = ({ params }: IProps) => {

    const [selected, setSelected] = useState<ISubCategory[] | []>([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);

    const { data: subCategories, isLoading, error, refetch } = useQuery({
        queryKey: [`subcategories, ${params?.subcategory}`],
        queryFn: async () => await axios.get(`/api/admin/sub-category/${params?.subcategory}`)
    });

    const { data: category,
        isLoading: categoryLoading,
        error: categoryError,
    } = useQuery({
        queryKey: [`${params?.subcategory}`],
        queryFn: async () => await axios.get(`/api/admin/category/${params?.subcategory}`)
    });

    error && console.log(error);
    categoryError && console.log(categoryError);

    const leftToolbarTemplate = () => {
        return (
            <>
                <DeleteSubCategory rowSelected={selected} refetch={refetch} setRowSelected={setSelected} />
                <UpdateSubCategory refetch={refetch} rowSelected={selected} setRowSelected={setSelected} />
            </>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <CreateSubCategory refetch={refetch} category={category?.data} />
            </>
        );
    };

    const codeBodyTemplate = (rowData: ISubCategory) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.id}
            </>
        );
    };

    const titleBodyTemplate = (rowData: ISubCategory) => {
        return (
            <>
                {rowData?.title?.toUpperCase()}
            </>
        );
    };


    const imageBodyTemplate = (rowData: ISubCategory) => {
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
                        isLoading || categoryLoading
                            ?
                            <SubCategorySkeleton />
                            :
                            <DataTable
                                ref={dt}
                                value={subCategories?.data}
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
                                header={<TableHeader data={subCategories?.data} setGlobalFilter={setGlobalFilter} title='Sub Categories' />}
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
                                    headerStyle={{ minWidth: "20rem" }}
                                />

                            </DataTable>
                    }

                </div>
            </div>
        </div>
    );
};

export default SubCategoryPage;
"use client"

import CreateSubCategoryInPage from '@/components/(crud)/SubCategory/CreateSubCategoryInPage';
import DeleteSubCategory from '@/components/(crud)/SubCategory/DeleteSubCategory';
import UpdateSubCategoryInPage from '@/components/(crud)/SubCategory/UpdateSubCategoryInPage';
import TableHeader from '@/components/Common/TableHeader';
import { ICreateCategoryItemType, IGetSubCategoriesItemType } from '@/types/common';
import { useRouter } from 'next/navigation';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Image } from 'primereact/image';
import { Toolbar } from 'primereact/toolbar';
import React, { useRef, useState } from 'react';


interface IProps {
    subCategories: IGetSubCategoriesItemType[];
    getCategories: ICreateCategoryItemType[]
}

const MainContextSubCategories = ({ subCategories, getCategories }: IProps) => {

    const [selected, setSelected] = useState<any>([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);

    const router = useRouter();

    const refreshData = () => {
        router.refresh();
    }

    const leftToolbarTemplate = () => {
        return (
            <>
                <DeleteSubCategory rowSelected={selected} setRowSelected={setSelected} refreshData={refreshData} />
                <UpdateSubCategoryInPage rowSelected={selected} setRowSelected={setSelected} categories={getCategories} refreshData={refreshData} />
            </>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <CreateSubCategoryInPage categories={getCategories} refreshData={refreshData} />
            </>
        );
    };

    const imageBodyTemplate = (rowData: any) => {
        return (
            <>
                <div className='flex justify-content-start'>
                    <Image
                        loading='lazy'
                        src={rowData?.media?.url}
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

                    <DataTable
                        ref={dt}
                        value={subCategories}
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
                        header={<TableHeader data={subCategories} setGlobalFilter={setGlobalFilter} title='Sub Categories' />}
                        responsiveLayout="scroll"
                    >
                        <Column
                            selectionMode="multiple"
                            headerStyle={{ width: '5rem' }}
                        />
                        <Column
                            field="id"
                            header="CODE"
                            sortable body={(rowData) => rowData.id}
                            headerStyle={{ minWidth: '5rem' }}
                        />
                        <Column
                            field="image"
                            header="IMAGE"
                            sortable
                            body={imageBodyTemplate}
                            headerStyle={{ minWidth: "10rem" }}
                        />

                        <Column
                            field="title"
                            header="TITLE"
                            sortable
                            body={(rowData) => rowData?.title}
                            headerStyle={{ minWidth: "20rem" }}
                        />
                        <Column
                            field="category.title"
                            header="CATEGORY"
                            sortable
                            body={(rowData) => rowData?.category?.title}
                            headerStyle={{ minWidth: "20rem" }}
                        />

                    </DataTable>


                </div>
            </div>
        </div>
    );
};

export default MainContextSubCategories;
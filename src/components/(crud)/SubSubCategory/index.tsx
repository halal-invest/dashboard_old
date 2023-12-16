"use client"
import TableHeader from '@/components/Common/TableHeader';
import { ICreateSubCategoryItemType, IGetSubSubCategoriesItemsType } from '@/types/common';
import { useRouter } from 'next/navigation';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Image } from 'primereact/image';
import { Toolbar } from 'primereact/toolbar';
import React, { useRef, useState } from 'react';
import CreateSubSubCategoryInPage from './CreateSubSubCategoryInPage';
import UpdateSubSubCategoryInPage from './UpdateSubSubCategory';
import DeleteSubSubCategory from './DeleteSubSubCategory';

interface IProps {
    subSubCategories: IGetSubSubCategoriesItemsType[];
    subCategories: ICreateSubCategoryItemType[];
}

const MainContextSubSubCategories = ({ subCategories, subSubCategories }: IProps) => {

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
                <DeleteSubSubCategory rowSelected={selected} setRowSelected={setSelected} refreshData={refreshData} />
                <UpdateSubSubCategoryInPage rowSelected={selected} setRowSelected={setSelected} subCategories={subCategories} refreshData={refreshData} />
            </>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <CreateSubSubCategoryInPage subCategories={subCategories} refreshData={refreshData} />
            </>
        );
    };

    const imageBodyTemplate = (rowData: IGetSubSubCategoriesItemsType) => {
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
                        value={subSubCategories}
                        selection={selected}
                        onSelectionChange={(e) => setSelected(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Sub sub Category"
                        globalFilter={globalFilter}
                        emptyMessage="No Sub Sub Category found."
                        header={<TableHeader data={subSubCategories} setGlobalFilter={setGlobalFilter} title='Sub Sub Categories' />}
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
                            header="SUB CATEGORY"
                            sortable
                            body={(rowData) => rowData.subCategory.title}
                            headerStyle={{ minWidth: "20rem" }}
                        />

                    </DataTable>


                </div>
            </div>
        </div>
    );
};

export default MainContextSubSubCategories;
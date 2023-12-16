"use client"
import TableHeader from '@/components/Common/TableHeader';
import { ICreateSubCategoryItemType, IGetProductsItemsTypes, IGetSubSubCategoriesItemsType } from '@/types/common';
import { useRouter } from 'next/navigation';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Image } from 'primereact/image';
import { Toolbar } from 'primereact/toolbar';
import React, { useRef, useState } from 'react';
import CreateProductInPage from './CreateProductInPage';
import DeleteProduct from './DeleteProduct';
import UpdateProductInPage from './UpdateProductInPage';


interface IProps {
    subCategories: ICreateSubCategoryItemType[];
    subSubCategories: ICreateSubCategoryItemType[];
    products: IGetProductsItemsTypes[];
}

const MainContextProducts = ({ subCategories, subSubCategories, products }: IProps) => {

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
                <DeleteProduct rowSelected={selected} setRowSelected={setSelected} refreshData={refreshData} />
                <UpdateProductInPage rowSelected={selected} setRowSelected={setSelected} subSubCategories={subSubCategories} subCategories={subCategories} refreshData={refreshData} />
            </>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <CreateProductInPage
                    subCategories={subCategories}
                    subSubCategories={subSubCategories}
                    refreshData={refreshData} />
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
                        value={products}
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
                        header={<TableHeader data={products} setGlobalFilter={setGlobalFilter} title='Sub Sub Categories' />}
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
                            field="title"
                            header="TITLE"
                            sortable
                            body={(rowData) => rowData?.title}
                            headerStyle={{ minWidth: "20rem" }}
                        />

                        <Column
                            field="sku"
                            header="SKU"
                            sortable
                            body={(rowData) => rowData?.sku}
                            headerStyle={{ minWidth: "10rem" }}
                        />

                        <Column
                            field="season"
                            header="SEASON"
                            sortable
                            body={(rowData) => rowData?.season}
                            headerStyle={{ minWidth: "10rem" }}
                        />

                        <Column
                            field="subCategory.title"
                            header="SUB CATEGORY"
                            sortable
                            body={(rowData) => rowData.subCategory ? rowData.subCategory.title : <p> Null</p>}
                            headerStyle={{ minWidth: "20rem" }}
                        />

                        <Column
                            field="subSubCategory.title"
                            header="SUB SUB CATEGORY"
                            sortable
                            body={(rowData) => rowData.subSubCategory ? rowData.subSubCategory.title : <p> Null </p>}
                            headerStyle={{ minWidth: "20rem" }}
                        />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default MainContextProducts;
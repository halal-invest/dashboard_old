"use client"

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toolbar } from 'primereact/toolbar';
import React, { useRef, useState } from 'react';
import { ICategory } from '@/types/common';
import CreateCategory from '@/components/(crud)/Category/CreateCategory';
import TableHeader from '@/components/Common/TableHeader';
import DeleteCategory from '@/components/(crud)/Category/DeleteCategory';
import UpdateCategory from '@/components/(crud)/Category/UpdateCategory';
import ShowSubCategory from '@/components/(crud)/Category/ShowSubCategory';
import { Image } from 'primereact/image';
import useCategories from '@/hooks/useCategories';

interface IProps {
    categories: any;
}


const MainContextCategories = ({ categories }: IProps) => {

    const [selected, setSelected] = useState<ICategory[] | []>([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);

    // const { data: categories, isLoading, error, refetch } = useCategories();
    // error && console.log(error);


    const leftToolbarTemplate = () => {
        return (
            <>
                <DeleteCategory rowSelected={selected} setRowSelected={setSelected} />
                <UpdateCategory rowSelected={selected} setRowSelected={setSelected} />
            </>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <ShowSubCategory selected={selected} />
                <CreateCategory />
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
                        value={categories}
                        selection={selected}
                        onSelectionChange={(e) => setSelected(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Categories"
                        globalFilter={globalFilter}
                        emptyMessage="No Category found."
                        header={<TableHeader data={categories} setGlobalFilter={setGlobalFilter} title='Categories' />}
                        responsiveLayout="scroll"
                    >
                        <Column
                            selectionMode="multiple"
                            headerStyle={{ width: '5rem' }}
                        />
                        <Column
                            field="id"
                            header="ID"
                            sortable
                            body={(rowData) => rowData.id}
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
                            body={(rowData) => rowData?.title}
                            headerStyle={{ minWidth: "15rem" }}
                        />

                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default MainContextCategories;
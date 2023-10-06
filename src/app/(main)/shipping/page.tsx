"use client"
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toolbar } from 'primereact/toolbar';
import React, { useRef, useState } from 'react';
import {IShippingType } from '@/types/common';
import TableHeader from '@/components/Common/TableHeader';
import useShipping from '@/hooks/useShipping';
import CreateShipping from '@/components/(crud)/(Payment)/Shipping/CreateShipping';
import ShippingSkeleton from '@/components/Skeleton/ShippingSkeleton';
import DeleteShipping from '@/components/(crud)/(Payment)/Shipping/DeleteShipping';
import UpdateShipping from '@/components/(crud)/(Payment)/Shipping/UpdateShipping';


const ShippingPage = () => {

    const [selected, setSelected] = useState<IShippingType[] | []>([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);

    const { data: shippings, isLoading, error, refetch } = useShipping();

    error && console.log(error);


    const leftToolbarTemplate = () => {
        return (
            <>
                <DeleteShipping rowSelected={selected} refetch={refetch} setRowSelected={setSelected} />
                <UpdateShipping refetch={refetch} rowSelected={selected} setRowSelected={setSelected} />
            </>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <CreateShipping refetch={refetch} />
            </>
        );
    };

    const titleBodyTemplate = (rowData: IShippingType) => {
        return (
            <>
                {rowData?.title?.toUpperCase()}
            </>
        );
    };

    const costBodyTemplate = (rowData: IShippingType) => {
        return (
            <>
                {rowData?.cost}
            </>
        );
    };

    const descriptionBodyTemplate = (rowData: IShippingType) => {
        return (
            <>
                {rowData?.description}
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
                            <ShippingSkeleton />
                            :
                            <DataTable
                                ref={dt}
                                value={shippings?.data}
                                selection={selected}
                                onSelectionChange={(e) => setSelected(e.value as any)}
                                dataKey="id"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} payment shipping"
                                globalFilter={globalFilter}
                                emptyMessage="No shipping found."
                                header={<TableHeader data={shippings?.data} setGlobalFilter={setGlobalFilter} title='shippings' />}
                                responsiveLayout="scroll"
                            >
                                <Column
                                    selectionMode="multiple"
                                    headerStyle={{ width: '5rem' }}
                                />

                                <Column
                                    field="title"
                                    header="TITLE"
                                    sortable
                                    body={titleBodyTemplate}
                                    headerStyle={{ minWidth: "15rem" }}
                                />

                                <Column
                                    field="cost"
                                    header="COST"
                                    sortable
                                    body={costBodyTemplate}
                                    headerStyle={{ minWidth: "15rem" }}
                                />

                                <Column
                                    field="description"
                                    header="DESCRIPTION"
                                    sortable
                                    body={descriptionBodyTemplate}
                                    headerStyle={{ minWidth: "15rem" }}
                                />

                            </DataTable>
                    }

                </div>
            </div>
        </div>
    );
};

export default ShippingPage;
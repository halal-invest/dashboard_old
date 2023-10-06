"use client"
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toolbar } from 'primereact/toolbar';
import React, { useRef, useState } from 'react';
import { IPaymentMethodType } from '@/types/common';
import TableHeader from '@/components/Common/TableHeader';
import usePaymentMethod from '@/hooks/usePaymentMethod';
import PaymentMethodSkeleton from '@/components/Skeleton/PaymentMethodSkeleton';
import CreatePaymentMethod from '@/components/(crud)/(Payment)/PaymentMethod/CreatePaymentMethod';
import DeletePaymentMethod from '@/components/(crud)/(Payment)/PaymentMethod/DeletePaymentMethod';
import UpdatePaymentMethod from '@/components/(crud)/(Payment)/PaymentMethod/UpdatePaymentMethod';


const PaymentMethodPage = () => {

    const [selected, setSelected] = useState<IPaymentMethodType[] | []>([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);

    const { data: paymentMethods, isLoading, error, refetch } = usePaymentMethod();

    error && console.log(error);


    const leftToolbarTemplate = () => {
        return (
            <>
                <DeletePaymentMethod rowSelected={selected} refetch={refetch} setRowSelected={setSelected} />
                <UpdatePaymentMethod refetch={refetch} rowSelected={selected} setRowSelected={setSelected} />
            </>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <CreatePaymentMethod refetch={refetch} />
            </>
        );
    };

    const titleBodyTemplate = (rowData: IPaymentMethodType) => {
        return (
            <>
                {rowData?.title?.toUpperCase()}
            </>
        );
    };

    const descriptionBodyTemplate = (rowData: IPaymentMethodType) => {
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
                            <PaymentMethodSkeleton />
                            :
                            <DataTable
                                ref={dt}
                                value={paymentMethods?.data}
                                selection={selected}
                                onSelectionChange={(e) => setSelected(e.value as any)}
                                dataKey="id"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} payment method"
                                globalFilter={globalFilter}
                                emptyMessage="No payment method found."
                                header={<TableHeader data={paymentMethods?.data} setGlobalFilter={setGlobalFilter} title='Payment Methods' />}
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

export default PaymentMethodPage;
"use client"

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toolbar } from 'primereact/toolbar';
import React, { useRef, useState } from 'react';
import { IPaymentMethodType } from '@/types/common';
import TableHeader from '@/components/Common/TableHeader';
import CreatePaymentMethod from '@/components/(crud)/(Payment)/PaymentMethod/CreatePaymentMethod';
import DeletePaymentMethod from '@/components/(crud)/(Payment)/PaymentMethod/DeletePaymentMethod';
import UpdatePaymentMethod from '@/components/(crud)/(Payment)/PaymentMethod/UpdatePaymentMethod';
import { useRouter } from 'next/navigation';


const MainContextPaymentMethod = ({ paymentMethods }: { paymentMethods: IPaymentMethodType[] }) => {

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
                <DeletePaymentMethod rowSelected={selected} refetch={refreshData} setRowSelected={setSelected} />
                <UpdatePaymentMethod refetch={refreshData} rowSelected={selected} setRowSelected={setSelected} />
            </>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <CreatePaymentMethod refetch={refreshData} />
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
                        value={paymentMethods}
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
                        header={<TableHeader data={paymentMethods} setGlobalFilter={setGlobalFilter} title='Payment Methods' />}
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
                            body={(rowData) => rowData.title}
                            headerStyle={{ minWidth: "15rem" }}
                        />

                        <Column
                            field="description"
                            header="DESCRIPTION"
                            sortable
                            body={(rowData) => rowData.description}
                            headerStyle={{ minWidth: "15rem" }}
                        />

                    </DataTable>

                </div>
            </div>
        </div>
    );
};

export default MainContextPaymentMethod;
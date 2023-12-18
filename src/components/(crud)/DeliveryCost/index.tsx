'use client';
import TableHeader from '@/components/Common/TableHeader';
import { IDeliveryCostType } from '@/types/common';
import { useRouter } from 'next/navigation';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toolbar } from 'primereact/toolbar';
import React, { useRef, useState } from 'react';
import DeleteDeliveryCost from './DeleteDeliveryCost';
import UpdateDeliveryCost from './UpdateDeliveryCost';
import CreateDeliveryCost from './CreateDeliveryCost';

interface IProps {
    deliveryCosts: IDeliveryCostType[];
}

const MainContextDeliveryCost = ({ deliveryCosts }: IProps) => {
    const [selected, setSelected] = useState<any>([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);

    const router = useRouter();

    const refreshData = () => {
        router.refresh();
    };

    const leftToolbarTemplate = () => {
        return (
            <>
                <DeleteDeliveryCost rowSelected={selected} setRowSelected={setSelected} refreshData={refreshData} />
                <UpdateDeliveryCost rowSelected={selected} setRowSelected={setSelected} refreshData={refreshData} />
            </>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <CreateDeliveryCost refreshData={refreshData} />
            </>
        );
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toolbar className="mb-2" right={rightToolbarTemplate} left={leftToolbarTemplate} />

                    <DataTable
                        ref={dt}
                        value={deliveryCosts}
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
                        emptyMessage="No Delivery Cost found."
                        header={<TableHeader data={deliveryCosts} setGlobalFilter={setGlobalFilter} title="Delivery Costs" />}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '5rem' }} />
                        <Column field="id" header="CODE" sortable body={(rowData) => rowData.id} headerStyle={{ minWidth: '5rem' }} />

                        <Column field="title" header="Area Name" sortable body={(rowData) => rowData?.areaName} headerStyle={{ minWidth: '20rem' }} />
                        <Column field="title" header="Cost" sortable body={(rowData) => rowData?.cost} headerStyle={{ minWidth: '20rem' }} />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default MainContextDeliveryCost;

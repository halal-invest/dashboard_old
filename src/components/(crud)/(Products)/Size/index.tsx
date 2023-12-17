"use client"
import TableHeader from '@/components/Common/TableHeader';
import { ISizedType } from '@/types/common';
import { useRouter } from 'next/navigation';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toolbar } from 'primereact/toolbar';
import React, { useRef, useState } from 'react';
import DeleteSize from './DeleteSize';
import CreateSize from './CreateSize';
import UpdateSize from './UpdateSize';


interface IProps {
    sizes: ISizedType[];
}

const MainContextSize = ({ sizes }: IProps) => {

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
                <DeleteSize rowSelected={selected} setRowSelected={setSelected} refreshData={refreshData} />
                <UpdateSize rowSelected={selected} setRowSelected={setSelected} refreshData={refreshData} />
            </>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <CreateSize refreshData={refreshData} />
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
                        value={sizes}
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
                        header={<TableHeader data={sizes} setGlobalFilter={setGlobalFilter} title='Sizes' />}
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
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default MainContextSize;
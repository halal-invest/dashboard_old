'use client';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toolbar } from 'primereact/toolbar';
import React, { useRef, useState } from 'react';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import { useRouter } from 'next/navigation';
import CreatePermission from './CreatePermission';
import DeletePermission from './DeletePermission';
import UpdatePermission from './UpdatePermission';

interface IProps {
    permissions: any;
}

const MainContextPermission = ({ permissions = [[]] }: IProps) => {
    const [selected, setSelected] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);
    const router = useRouter();

    const refreshData = () => {
        router.refresh();
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">
                Permissions -
                <Badge className="ml-2 pb-3" value={permissions?.length} size="normal" severity="success" />
            </h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value as any)} placeholder="Search..." />
            </span>
        </div>
    );

    const leftToolbarTemplate = () => {
        return (
            <>
                <DeletePermission rowSelected={selected} setRowSelected={setSelected} refetch={refreshData} />
                <UpdatePermission rowSelected={selected} setRowSelected={setSelected} refetch={refreshData} />
            </>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <CreatePermission refetch={refreshData} />
            </>
        );
    };

    return (
        <>
            <div className="grid crud-demo">
                <div className="col-12">
                    <div className="card">
                        <Toolbar className="mb-4" right={rightToolbarTemplate} left={leftToolbarTemplate} />

                        <DataTable
                            ref={dt}
                            value={permissions}
                            selection={selected}
                            onSelectionChange={(e) => setSelected(e.value as any)}
                            dataKey="id"
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Permissions"
                            globalFilter={globalFilter}
                            emptyMessage="No Permission found."
                            header={header}
                            responsiveLayout="scroll"
                        >
                            <Column selectionMode="multiple" headerStyle={{ width: '4rem' }} />
                            <Column field="id" header="ID" sortable body={(rowData) => rowData.id} headerStyle={{ minWidth: '5rem' }} />
                            <Column field="title" header="Title" sortable body={(rowData) => rowData.title} headerStyle={{ minWidth: '15rem' }} />
                            <Column field="description" header="Description" sortable body={(rowData) => rowData.description} headerStyle={{ minWidth: '15rem' }} />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MainContextPermission;

"use client"
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Skeleton } from 'primereact/skeleton';
import React from 'react';

const PaymentMethodSkeleton = () => {
    const items = [
        { item: 1 },
        { item: 1 },
        { item: 1 },
        { item: 1 },
        { item: 1 },
    ]
    return (
        <div className="card">
            <DataTable value={items} className="p-datatable-striped">

                <Column
                    header="TITLE"
                    style={{ width: '50%' }}
                    body={<Skeleton />}
                />

                <Column
                    header="DESCRIPTION"
                    style={{ width: '50%' }}
                    body={<Skeleton />}
                />
            </DataTable>
        </div>
    );
};

export default PaymentMethodSkeleton;
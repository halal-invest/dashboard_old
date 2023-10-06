"use client"
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Skeleton } from 'primereact/skeleton';
import React from 'react';

const CouponSkeleton = () => {
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
                    style={{ width: '25%' }}
                    body={<Skeleton />}
                />
                <Column
                    header="DISCOUNT"
                    style={{ width: '25%' }}
                    body={<Skeleton />}
                />
                <Column
                    header="TYPE"
                    style={{ width: '25%' }}
                    body={<Skeleton />}
                />
                <Column
                    header="STATUS"
                    style={{ width: '25%' }}
                    body={<Skeleton />}
                />
            </DataTable>
        </div>
    );
};

export default CouponSkeleton;
"use client"
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Skeleton } from 'primereact/skeleton';
import React from 'react';

const CategorySkeleton = () => {
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
                    header="CODE"
                    style={{ width: '20%' }}
                    body={<Skeleton />}
                />

                <Column
                    header="IMAGE"
                    style={{ width: '10%' }}
                    body={<Skeleton shape="circle" size="5rem" />}
                />

                <Column
                    header="TITLE"
                    style={{ width: '70%' }}
                    body={<Skeleton />}
                />
            </DataTable>
        </div>
    );
};

export default CategorySkeleton;
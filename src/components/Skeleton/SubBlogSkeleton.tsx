"use client"
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Skeleton } from 'primereact/skeleton';
import React from 'react';

const SubBlogSkeleton = () => {
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
                    header="TITLE"
                    style={{ width: '80%' }}
                    body={<Skeleton />}
                />
            </DataTable>
        </div>
    );
};

export default SubBlogSkeleton;
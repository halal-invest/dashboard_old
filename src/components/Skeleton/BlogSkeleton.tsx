"use client"
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Skeleton } from 'primereact/skeleton';
import React from 'react';

const BlogSkeleton = () => {
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
                    header="IMAGE"
                    style={{ width: '20%' }}
                    body={<Skeleton shape="circle" size="5rem" />}
                />

                <Column
                    header="TITLE"
                    style={{ width: '60%' }}
                    body={<Skeleton />}
                />

                <Column
                    header="SUB-BLOG"
                    style={{ width: '20%' }}
                    body={<Skeleton />}
                />
            </DataTable>
        </div>
    );
};

export default BlogSkeleton;
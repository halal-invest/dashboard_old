"use client"
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Skeleton } from 'primereact/skeleton';
import React from 'react';

const SubCategoriesSkeleton = () => {
    const items = [
        { item: 1 },
        { item: 1 },
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
                    header="SELECT"
                    style={{ width: '10%' }}
                    body={<Skeleton />}
                />

                <Column
                    header="CODE"
                    style={{ width: '10%' }}
                    body={<Skeleton />}
                />


                <Column
                    header="IMAGE"
                    style={{ width: '20%' }}
                    body={<Skeleton shape="circle" size="5rem" />}
                />

                <Column
                    header="TITLE"
                    style={{ width: '30%' }}
                    body={<Skeleton />}
                />
                <Column
                    header="CATEGORY"
                    style={{ width: '30%' }}
                    body={<Skeleton />}
                />
            </DataTable>
        </div>
    );
};

export default SubCategoriesSkeleton;
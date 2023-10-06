"use client"
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toolbar } from 'primereact/toolbar';
import React, { useRef, useState } from 'react';
import { ICouponType } from '@/types/common';
import TableHeader from '@/components/Common/TableHeader';
import CreateCoupon from '@/components/(crud)/Coupon/CreateCoupon';
import useCoupons from '@/hooks/useCoupons';
import CouponSkeleton from '@/components/Skeleton/CouponSkeleton';
import DeleteCoupon from '@/components/(crud)/Coupon/DeleteCoupon';
import UpdateCoupon from '@/components/(crud)/Coupon/UpdateCoupon';
import { Button } from 'primereact/button';


const CouponPage = () => {

    const [selected, setSelected] = useState<ICouponType[]>([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);


    const { data, isLoading, error, refetch } = useCoupons();

    error && console.log(error);


    const leftToolbarTemplate = () => {
        return (
            <>

                <UpdateCoupon refetch={refetch} rowSelected={selected} setRowSelected={setSelected} />
                <DeleteCoupon rowSelected={selected} refetch={refetch} setRowSelected={setSelected} />

            </>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <CreateCoupon refetch={refetch} />
            </>
        );
    };

    const titleBodyTemplate = (rowData: ICouponType) => {
        return (
            <>
                {rowData?.title?.toUpperCase()}
            </>
        );
    };

    const discountTemplate = (rowData: ICouponType) => {
        return (
            <>
                {rowData?.discount}
            </>
        );
    };
    
    const typeTemplate = (rowData: ICouponType) => {
        return (
            <>
                {rowData?.type}
            </>
        );
    };

    const statusTemplate = (rowData: ICouponType) => {
        return (
            <>
                {rowData.status ? (
                    <Button size='small' className='p-2' label="Active" severity="success" text />
                ) : (
                    <Button size='small' className='p-2' label="Inactive" severity="danger" text />
                )}
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
                    {
                        isLoading
                            ?
                            <CouponSkeleton />
                            :
                            <DataTable
                                ref={dt}
                                value={data?.data}
                                selection={selected}
                                onSelectionChange={(e) => setSelected(e.value as any)}
                                dataKey="id"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} coupons"
                                globalFilter={globalFilter}
                                emptyMessage="No Coupon found."
                                header={<TableHeader data={data?.data} setGlobalFilter={setGlobalFilter} title='coupons' />}
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
                                    body={titleBodyTemplate}
                                    headerStyle={{ minWidth: "15rem" }}
                                />
                                <Column
                                    field="discount"
                                    header="DISCOUNT"
                                    sortable
                                    body={discountTemplate}
                                    headerStyle={{ minWidth: "15rem" }}
                                />
                                <Column
                                    field="type"
                                    header="TYPE"
                                    sortable
                                    body={typeTemplate}
                                    headerStyle={{ minWidth: "15rem" }}
                                />
                                <Column
                                    field="status"
                                    header="STATUS"
                                    sortable
                                    body={statusTemplate}
                                    headerStyle={{ minWidth: "15rem" }}
                                />

                            </DataTable>
                    }

                </div>
            </div>
        </div>
    );
};

export default CouponPage;
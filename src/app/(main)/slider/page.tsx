"use client"
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toolbar } from 'primereact/toolbar';
import React, { useRef, useState } from 'react';
import { IPaymentMethodType, ISliderType } from '@/types/common';
import TableHeader from '@/components/Common/TableHeader';
import usePaymentMethod from '@/hooks/usePaymentMethod';
import PaymentMethodSkeleton from '@/components/Skeleton/PaymentMethodSkeleton';
import CreatePaymentMethod from '@/components/(crud)/(Payment)/PaymentMethod/CreatePaymentMethod';
import DeletePaymentMethod from '@/components/(crud)/(Payment)/PaymentMethod/DeletePaymentMethod';
import UpdatePaymentMethod from '@/components/(crud)/(Payment)/PaymentMethod/UpdatePaymentMethod';
import DeleteSlider from '@/components/(crud)/Slider/DeleteSlider';
import UpdateSlider from '@/components/(crud)/Slider/UpdateSlider';
import useSlider from '@/hooks/useSlider';
import CreateSlider from '@/components/(crud)/Slider/CreateSlider';
import { Image } from 'primereact/image';


const SliderPage = () => {

    const [selected, setSelected] = useState<ISliderType[] | []>([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);

    const { data: sliders, isLoading, error, refetch } = useSlider();

    error && console.log(error);


    const leftToolbarTemplate = () => {
        return (
            <>
                <DeleteSlider rowSelected={selected} refetch={refetch} setRowSelected={setSelected} />
                <UpdateSlider refetch={refetch} rowSelected={selected} setRowSelected={setSelected} />
            </>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <CreateSlider refetch={refetch} />
            </>
        );
    };

    const imageBodyTemplate = (rowData: ISliderType) => {
        return (
            <>
                <div className='flex justify-content-start'>
                    <Image
                        loading='lazy'
                        src={rowData?.image}
                        alt="Image"
                        height='40'
                        width="50"
                        preview />
                </div>
            </>
        );
    };

    const descriptionBodyTemplate = (rowData: ISliderType) => {
        return (
            <>
                {rowData?.description}
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
                            <PaymentMethodSkeleton />
                            :
                            <DataTable
                                ref={dt}
                                value={sliders?.data}
                                selection={selected}
                                onSelectionChange={(e) => setSelected(e.value as any)}
                                dataKey="id"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} sliders"
                                globalFilter={globalFilter}
                                emptyMessage="No slider found."
                                header={<TableHeader data={sliders?.data} setGlobalFilter={setGlobalFilter} title='sliders' />}
                                responsiveLayout="scroll"
                            >
                                <Column
                                    selectionMode="multiple"
                                    headerStyle={{ width: '5rem' }}
                                />

                                <Column
                                    field="image"
                                    header="IMAGE"
                                    sortable
                                    body={imageBodyTemplate}
                                    headerStyle={{ minWidth: "15rem" }}
                                />

                                <Column
                                    field="description"
                                    header="DESCRIPTION"
                                    sortable
                                    body={descriptionBodyTemplate}
                                    headerStyle={{ minWidth: "15rem" }}
                                />

                            </DataTable>
                    }

                </div>
            </div>
        </div>
    );
};

export default SliderPage;
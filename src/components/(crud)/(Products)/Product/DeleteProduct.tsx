import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import DeleteFooterButtons from '@/components/Common/DeleteFooterButtons';
import DeleteConfirmContent from '@/components/Common/DeleteConfirmContent';
import { IGetProductsItemsTypes, IGetSubCategoriesItemType, ISubCategory } from '@/types/common';
import DeleteModalButton from '@/components/Common/(Button)/DeleteModalButton';

interface IProps {
    rowSelected: IGetProductsItemsTypes[];
    setRowSelected: any;
    refreshData: any;
}


const DeleteProduct = ({ rowSelected, setRowSelected, refreshData }: IProps) => {

    const [dialog, setDialog] = useState<boolean>(false);
    const [select, setSelect] = useState<IGetSubCategoriesItemType[]>([]);
    const toast = useRef<Toast>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const deleteHandler = async () => {
        setIsLoading(true);

        const id = select && select.map((sl: any) => sl.id);


        try {
            const { data } = await axios.delete("/api/admin/product", {
                data: { id }
            });

            if (data?.status) {
                toast.current?.show({
                    severity: "success",
                    detail: `${data?.message}`,
                    life: 3000,
                });
                refreshData();
                setDialog(false);
                setIsLoading(false);
                setRowSelected([]);
            } else {
                toast.current?.show({
                    severity: "error",
                    detail: `${data?.message}`,
                    life: 3000,
                });
                setIsLoading(false);
                setDialog(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const confirmDelete = (rowData: any) => {
        setSelect(rowData);
        setDialog(true);
    };


    return (

        <>
            <Toast ref={toast} />

            <Dialog
                visible={dialog}
                style={{ width: "400px" }}
                header="Confirm"
                modal
                footer={<DeleteFooterButtons setDialog={setDialog} deleteHandler={deleteHandler} />}
                onHide={() => setDialog(false)}
            >
                <DeleteConfirmContent isLoading={isLoading} select={select} />
            </Dialog>


            <DeleteModalButton
                confirmDelete={confirmDelete}
                data={rowSelected}
                disable={rowSelected?.length == 0}
            />

        </>

    );
};

export default DeleteProduct;
'use client';
import { Button } from 'primereact/button';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';

interface Permissions {
    id: number;
    title: string;
    description: string;
}

const DeletePermission = ({ rowSelected, refetch, setRowSelected }: { rowSelected: Permissions[] | null; setRowSelected: any; refetch: () => void }) => {
    const [dialog, setDialog] = useState<boolean>(false);
    const [select, setSelect] = useState<Permissions[]>([]);
    const toast = useRef<Toast>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const deleteHandler = async () => {
        setIsLoading(true);

        const id = select && select.map((sl: any) => sl.id);

        try {
            const { data } = await axios.delete('/api/user_management/permissions', {
                data: { id }
            });

            if (data?.status) {
                toast.current?.show({
                    severity: 'success',
                    detail: `${data?.message}`,
                    life: 3000
                });
                refetch();
                setDialog(false);
                setIsLoading(false);
                setRowSelected([]);
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `${data?.message}`,
                    life: 3000
                });
                setIsLoading(false);
                setDialog(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const dialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={() => setDialog(false)} />
            <Button label="Delete" icon="pi pi-check" text onClick={deleteHandler} />
        </>
    );

    const confirmDelete = (rowData: any) => {
        setSelect(rowData);
        setDialog(true);
    };

    return (
        <>
            <Toast ref={toast} />

            <Dialog visible={dialog} style={{ width: '450px' }} header="Confirm" modal footer={dialogFooter} onHide={() => setDialog(false)}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {select && <span>Are you sure you want to delete?</span>}
                </div>
                {isLoading && <ProgressBar mode="indeterminate" className="mt-5" style={{ height: '6px', width: '200px', margin: '0px auto' }} />}
            </Dialog>

            <Button label="Delete" disabled={rowSelected?.length == 0} icon="pi pi-trash" severity="danger" className="mr-2" onClick={() => confirmDelete(rowSelected)} />
        </>
    );
};

export default DeletePermission;

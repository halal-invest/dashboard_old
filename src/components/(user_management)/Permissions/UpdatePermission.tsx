'use client';
import { Button } from 'primereact/button';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

export interface PermissionProps {
    id: number;
    title: string;
    description: string;
}

const UpdatePermission = ({ rowSelected, refetch, setRowSelected }: { rowSelected: PermissionProps[] | null; setRowSelected: any; refetch: () => void }) => {
    const [dialog, setDialog] = useState<boolean>(false);
    const [id, setId] = useState(null);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const toast = useRef<Toast>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const updateHandler = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setSubmitted(true);

        try {
            const { data } = await axios.patch('/api/user_management/permissions', {
                id,
                title,
                description
            });

            if (data.status) {
                toast.current?.show({
                    severity: 'success',
                    detail: `${data.message}`,
                    life: 3000
                });
                refetch();
                setDialog(false);
                setIsLoading(false);
                setSubmitted(false);
                setRowSelected([]);
            } else {
                toast.current?.show({
                    severity: 'error',
                    detail: `${data.message}`,
                    life: 3000
                });
                setDialog(false);
                setIsLoading(false);
                setSubmitted(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const confirmUpdate = (rowData: any) => {
        setId(rowData[0].id);
        setTitle(rowData[0].title);
        setDescription(rowData[0].description);
        setDialog(true);
    };

    const handleHide = () => {
        setDialog(false);
        setRowSelected([]);
    };

    return (
        <>
            <Toast ref={toast} />

            <Dialog visible={dialog} style={{ width: '500px' }} header="Update Permission" modal className="p-fluid" onHide={handleHide}>
                <form onSubmit={updateHandler}>
                    <div>
                        <div className="field col-12">
                            <label htmlFor="title"> Title </label>
                            <InputText
                                id="title"
                                value={title}
                                autoFocus
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className={classNames({
                                    'p-invalid': submitted && !title
                                })}
                            />
                            {!submitted && !title && (
                                <small style={{ fontSize: '1rem', color: 'red' }} className="p-invalid">
                                    Title is required.
                                </small>
                            )}
                        </div>

                        <div className="field col-12">
                            <label htmlFor="des"> Description </label>
                            <InputText id="des" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        {isLoading && <ProgressBar mode="indeterminate" style={{ height: '6px', width: '300px', margin: '30px auto' }} />}
                        <Button disabled={!title} type="submit" label="SUBMIT" className="mt-10" />
                    </div>
                </form>
            </Dialog>

            <Button label="Update" disabled={rowSelected?.length !== 1} icon="pi pi-pencil" severity="secondary" className="mr-2" onClick={() => confirmUpdate(rowSelected)} />
        </>
    );
};

export default UpdatePermission;

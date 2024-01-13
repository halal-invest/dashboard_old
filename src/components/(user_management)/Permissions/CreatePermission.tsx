'use client';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import React, { useRef, useState } from 'react';
import axios from 'axios';

const CreatePermission = ({ refetch }: { refetch: () => void }) => {
    const [dialog, setDialog] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const toast = useRef<Toast>(null);

    const saveHandler = async (e: any) => {
        e.preventDefault();
        setSubmitted(true);
        setIsLoading(true);

        try {
            const { data } = await axios.post('/api/user_management/permissions', {
                title,
                description
            });
            if (data?.status) {
                toast.current?.show({
                    severity: 'success',
                    detail: `${data?.message}`,
                    life: 3000
                });
                refetch();
                setDialog(false);
                setTitle('');
                setDescription('');
                setSubmitted(false);
                setIsLoading(false);
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `${data?.message}`,
                    life: 1000
                });
                setSubmitted(false);
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleHide = () => {
        setDialog(false);
        setTitle('');
        setDescription('');
    };

    return (
        <>
            <Toast ref={toast} />

            <Button label="Add New" icon="pi pi-plus" severity="success" className="mr-2" onClick={() => setDialog(true)} />

            <Dialog visible={dialog} style={{ width: '500px' }} header="Create New Permission" modal className="p-fluid" onHide={handleHide}>
                <form onSubmit={saveHandler}>
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
        </>
    );
};

export default CreatePermission;

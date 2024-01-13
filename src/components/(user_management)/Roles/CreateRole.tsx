'use client';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { useQuery } from '@tanstack/react-query';

interface Permission {
    id: number;
    title: string;
    description: string;
}
const CreateRole = ({ refetch, permissions }: { refetch: () => void; permissions: Permission[] }) => {
    const [dialog, setDialog] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
    const [permissionId, setPermissionId] = useState<number[]>([]);

    const toast = useRef<Toast>(null);

    useEffect(() => {
        setPermissionId(selectedPermissions?.map((permission: Permission) => permission?.id));
    }, [selectedPermissions]);

    const saveHandler = async (e: any) => {
        e.preventDefault();
        setSubmitted(true);
        setIsLoading(true);

        try {
            const { data } = await axios.post('/api/user_management/roles', {
                title,
                description,
                permissions: permissionId
            });
            if (data?.status) {
                toast.current?.show({
                    severity: 'success',
                    detail: `${data?.message}`,
                    life: 1000
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
                    detail: `${data?.message}`,
                    life: 3000
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
        setSelectedPermissions([]);
    };

    const onPermissionChange = (e: CheckboxChangeEvent) => {
        let _selectedPermissions = [...selectedPermissions];

        if (e.checked) _selectedPermissions.push(e.value);
        else _selectedPermissions = _selectedPermissions.filter((permission) => permission.id !== e.value.id);

        setSelectedPermissions(_selectedPermissions);
    };

    return (
        <>
            <Toast ref={toast} />

            <Button label="Add New" icon="pi pi-plus" severity="success" className="mr-2" onClick={() => setDialog(true)} />

            <Dialog visible={dialog} style={{ width: '500px' }} header="Create Role" modal className="p-fluid" onHide={handleHide}>
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

                        <div className="card flex justify-content-center">
                            <div className="flex flex-column gap-3">
                                {permissions?.map((permission: Permission) => {
                                    return (
                                        <div key={permission?.id} className="flex align-items-center">
                                            <Checkbox inputId={permission?.id?.toString()} name="permission" value={permission} onChange={onPermissionChange} checked={selectedPermissions?.some((item: any) => item?.id === permission?.id)} />
                                            <label htmlFor={permission?.id?.toString()} className="ml-2 flex">
                                                <span className="flex"> {permission?.title} </span>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        {isLoading && <ProgressBar mode="indeterminate" style={{ height: '6px', width: '300px', margin: '30px auto' }} />}
                        <Button disabled={!title || permissionId.length === 0} type="submit" label="SUBMIT" className="mt-10" />
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default CreateRole;

'use client';
import { Button } from 'primereact/button';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';

interface Permission {
    id: number;
    title: string;
    description: string;
}
const UpdateRole = ({ rowSelected, refetch, setRowSelected, permissions }: { rowSelected: Permission[] | null; setRowSelected: any; refetch: () => void; permissions: Permission[] }) => {
    const [dialog, setDialog] = useState<boolean>(false);
    const [id, setId] = useState(null);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const toast = useRef<Toast>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
    const [permissionId, setPermissionId] = useState<number[]>([]);

    useEffect(() => {
        setPermissionId(selectedPermissions?.map((permission: any) => permission?.id));
    }, [selectedPermissions]);

    const onPermissionChange = (e: CheckboxChangeEvent) => {
        let _selectedPermissions = [...selectedPermissions];
        if (e.checked) _selectedPermissions.push(e.value);
        else _selectedPermissions = _selectedPermissions.filter((permission) => permission.id !== e.value.id);

        setSelectedPermissions(_selectedPermissions);
    };

    const updateHandler = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setSubmitted(true);

        try {
            const { data } = await axios.patch('/api/user_management/roles', {
                id: id,
                title: title,
                description: description,
                permissions: permissionId
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
        // const permissionIds = rowData[0]?.permissions?.map((p: Permission) => (p.id));
        setSelectedPermissions(rowData[0]?.permissions);
    };

    const handleHide = () => {
        setDialog(false);
        setRowSelected([]);
    };

    return (
        <>
            <Toast ref={toast} />

            <Dialog visible={dialog} style={{ width: '500px' }} header="Update Role" modal className="p-fluid" onHide={handleHide}>
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

                    <div style={{ marginTop: '30px' }}>
                        {isLoading && <ProgressBar mode="indeterminate" style={{ height: '6px', width: '300px', margin: '30px auto' }} />}
                        <Button disabled={!title || permissionId.length === 0} type="submit" label="SUBMIT" className="mt-10" />
                    </div>
                </form>
            </Dialog>

            <Button label="Update" disabled={rowSelected?.length !== 1} icon="pi pi-pencil" severity="secondary" className="mr-2" onClick={() => confirmUpdate(rowSelected)} />
        </>
    );
};

export default UpdateRole;

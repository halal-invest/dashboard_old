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
import { Message } from 'primereact/message';

interface Role {
    id: number;
    title: string;
    description: string;
}

const UpdateUser = ({ rowSelected, refetch, setRowSelected, roles = [] }: { rowSelected: Role[] | null; setRowSelected: any; refetch: () => void; roles: any }) => {
    const [dialog, setDialog] = useState<boolean>(false);
    const [id, setId] = useState(null);
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const toast = useRef<Toast>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
    const [rolesId, setRolesId] = useState<number[]>([]);

    useEffect(() => {
        setRolesId(selectedRoles?.map((role: any) => role?.id));
    }, [selectedRoles]);

    const onRoleChange = (e: CheckboxChangeEvent) => {
        let _selectedRoles = [...selectedRoles];
        if (e.checked) _selectedRoles.push(e.value);
        else _selectedRoles = _selectedRoles.filter((permission) => permission.id !== e.value.id);

        setSelectedRoles(_selectedRoles);
    };

    const updateHandler = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setSubmitted(true);

        try {
            const { data } = await axios.put('/api/user_management/users', {
                id: id,
                password,
                email,
                roles: rolesId
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
        setPassword('');
        setEmail(rowData[0].email);
        setDialog(true);
        setSelectedRoles(rowData[0]?.roles);
    };

    const handleHide = () => {
        setDialog(false);
        setRowSelected([]);
    };

    return (
        <>
            <Toast ref={toast} />

            <Dialog visible={dialog} style={{ width: '500px' }} header="Update User" modal className="p-fluid" onHide={handleHide}>
                <form onSubmit={updateHandler}>
                    <div>
                        <div className="field col-12">
                            <label htmlFor="email"> Email </label>
                            <InputText
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className={classNames({
                                    'p-invalid': submitted && !email
                                })}
                            />
                            {!submitted && !email && (
                                <small style={{ fontSize: '1rem', color: 'red' }} className="p-invalid">
                                    email is required.
                                </small>
                            )}
                        </div>
                    </div>

                    <div className="field col-12">
                        <label htmlFor="password"> Password </label>
                        <InputText
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={classNames({
                                'p-invalid': submitted && !password
                            })}
                        />
                    </div>

                    <Message text="Roles" />

                    <div className="card flex justify-content-center" style={{ marginBottom: '1rem', padding: '1rem' }}>
                        <div className="">
                            {roles?.map((role: Role) => {
                                return (
                                    <div key={role?.id} className="flex align-items-center my-1">
                                        <Checkbox inputId={role?.id?.toString()} name="role" value={role} onChange={onRoleChange} checked={selectedRoles?.some((item: any) => item?.id === role?.id)} />
                                        <label htmlFor={role?.id?.toString()} className="ml-2 flex">
                                            <span className="flex"> {role?.title} </span>
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        {isLoading && <ProgressBar mode="indeterminate" style={{ height: '6px', width: '300px', margin: '30px auto' }} />}
                        <Button disabled={!email || !password || !selectedRoles} type="submit" label="SUBMIT" className="mt-10" />
                    </div>
                </form>
            </Dialog>

            <Button label="Update" disabled={rowSelected?.length !== 1} icon="pi pi-pencil" severity="secondary" className="mr-2" onClick={() => confirmUpdate(rowSelected)} />
        </>
    );
};

export default UpdateUser;

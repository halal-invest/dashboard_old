'use client';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { Message } from 'primereact/message';

interface Role {
    id: number;
    title: string;
}

const CreateUser = ({ refetch, roles = [] }: { refetch: () => void; roles: any }) => {
    const [dialog, setDialog] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const toast = useRef<Toast>(null);

    const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);

    const onCategoryChange = (e: CheckboxChangeEvent) => {
        let _selectedRoles = [...selectedRoles];

        if (e.checked) _selectedRoles.push(e.value);
        else _selectedRoles = _selectedRoles.filter((permission) => permission.id !== e.value.id);

        setSelectedRoles(_selectedRoles);
    };

    const saveHandler = async (e: any) => {
        e.preventDefault();
        setSubmitted(true);
        setIsLoading(true);

        try {
            const { data } = await axios.post('/api/user_management/users', {
                password,
                email,
                roles: selectedRoles
            });
            if (data?.status) {
                toast.current?.show({
                    severity: 'success',
                    detail: `${data?.message}`,
                    life: 3000
                });
                refetch();
                setDialog(false);
                setPassword('');
                setEmail('');
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
        setPassword('');
        setEmail('');
    };

    return (
        <>
            <Toast ref={toast} />

            <Button label="Add New" icon="pi pi-plus" severity="success" className="mr-2" onClick={() => setDialog(true)} />

            <Dialog visible={dialog} style={{ width: '500px' }} header="Create User" modal className="p-fluid" onHide={handleHide}>
                <form onSubmit={saveHandler}>
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

                        <div className="field col-12">
                            <label htmlFor="password"> Password </label>
                            <InputText
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className={classNames({
                                    'p-invalid': submitted && !password
                                })}
                            />
                            {!submitted && !password && (
                                <small style={{ fontSize: '1rem', color: 'red' }} className="p-invalid">
                                    password is required.
                                </small>
                            )}
                        </div>

                        <Message text="Roles" />
                        <div className="card flex justify-content-center" style={{ marginBottom: '1rem', padding: '1rem' }}>
                            <div className="flex gap-3">
                                {roles?.map((role: any) => {
                                    return (
                                        <div key={role.id} className="flex align-items-center">
                                            <Checkbox inputId={role.id} name="role" value={role.id} onChange={onCategoryChange} checked={selectedRoles.some((item) => item === role.id)} />
                                            <label htmlFor={role.id} className="ml-2">
                                                {role.title}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        {isLoading && <ProgressBar mode="indeterminate" style={{ height: '6px', width: '300px', margin: '30px auto' }} />}
                        <Button disabled={!password || !email || !selectedRoles} type="submit" label="SUBMIT" className="mt-10" />
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default CreateUser;

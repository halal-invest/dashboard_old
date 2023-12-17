import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { ISizedType } from '@/types/common';
import CustomInput from '@/components/Common/CustomInput';
import UpdateModalButton from '@/components/Common/(Button)/UpdateModalButton';
import { Button } from 'primereact/button';

interface IProps {
    rowSelected: ISizedType[];
    setRowSelected: any,
    refreshData: any;
}

const UpdateSize = ({ rowSelected, setRowSelected, refreshData }: IProps) => {

    const [dialog, setDialog] = useState<boolean>(false);
    const [id, setId] = useState<number | null>(null);
    const [title, setTitle] = useState<string>("");
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);


    const updateHandler = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setSubmitted(true);
        try {
            const { data } = await axios.patch(
                "/api/admin/size",
                {
                    id,
                    title,
                },
            );

            if (data.status) {
                toast.current?.show({
                    severity: "success",
                    detail: `${data.message}`,
                    life: 3000,
                });
                refreshData();
                setDialog(false);
                setIsLoading(false);
                setSubmitted(false);
                setRowSelected([]);
            } else {
                toast.current?.show({
                    severity: "error",
                    detail: `${data.message}`,
                    life: 3000,
                });
                setDialog(false);
                setIsLoading(false);
                setSubmitted(false)
            }

        } catch (error) {
            console.log(error);
        }
    }

    const confirmUpdate = (rowData: ISizedType[]) => {
        const { id, title } = rowData[0];
        setDialog(true);
        setId(id)
        setTitle(title);
    };

    const handleHide = () => {
        setDialog(false)
        setRowSelected([]);
    }

    return (

        <>
            <Toast ref={toast} />

            <Dialog
                visible={dialog}
                style={{ width: "600px" }}
                header="Update Size"
                modal
                className="p-fluid"
                onHide={handleHide}
            >
                <form onSubmit={updateHandler}>
                    <div>
                        <div className='formgrid grid col-12'>
                            <div className="field col-12 md:col">
                                <CustomInput
                                    label="TITLE"
                                    value={title}
                                    setValue={setTitle}
                                    submitted={submitted}
                                    required={true}
                                />
                            </div>

                        </div>

                        <div style={{ marginTop: "20px" }}>
                            <Button
                                disabled={!title}
                                type="submit"
                                severity="success"
                                label={isLoading ? "LOADING..." : "SUBMIT"}
                                size='small'
                                className="mt-10 p-2"
                            />
                        </div>
                    </div>
                </form>
            </Dialog>

            <UpdateModalButton
                data={rowSelected}
                confirmUpdate={confirmUpdate}
                disabled={rowSelected?.length !== 1}
            />
        </>

    );
};

export default UpdateSize;
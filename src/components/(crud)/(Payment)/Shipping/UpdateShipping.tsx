"use client"
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { IShippingType } from '@/types/common';
import CustomInput from '@/components/Common/CustomInput';
import SubmitLoading from '@/components/Common/SubmitLoading';
import UpdateModalButton from '@/components/Common/(Button)/UpdateModalButton';
import CustomInputNumber from '@/components/Common/CustomInputNumber';

const UpdateShipping = ({ rowSelected, refetch, setRowSelected }:
    {
        rowSelected: IShippingType[] | null,
        setRowSelected: any,
        refetch: () => void
    }) => {

    const [dialog, setDialog] = useState<boolean>(false);
    const [id, setId] = useState(null);
    const [title, setTitle] = useState<string>("");
    const [cost, setCost] = useState<number>(0);
    const [description, setDescription] = useState<string>("");

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);



    const updateHandler = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setSubmitted(true);

        try {

            const { data } = await axios.patch(
                "/api/admin/shipping",
                {
                    id,
                    title,
                    cost,
                    description
                },
            );

            if (data.status) {
                toast.current?.show({
                    severity: "success",
                    detail: `${data.message}`,
                    life: 1000,
                });
                refetch();
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

    const confirmUpdate = (rowData: any) => {
        setDialog(true);
        setId(rowData[0].id)
        setTitle(rowData[0].title);
        setCost(rowData[0].cost);
        setDescription(rowData[0].description);
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
                style={{ width: "400px" }}
                header="Update Shipping"
                modal
                className="p-fluid"
                onHide={handleHide}
            >
                <form onSubmit={updateHandler}>
                    <div>
                        <div className="field col-12">
                            <CustomInput
                                label="Title"
                                value={title}
                                focus={true}
                                setValue={setTitle}
                                submitted={submitted}
                                required={true}
                            />
                        </div>

                        <div className="field col-12">
                            <CustomInputNumber
                                label="cost"
                                value={cost}
                                setValue={setCost}
                                submitted={submitted}
                                required={true}
                            />
                        </div>
                        <div className="field col-12">
                            <CustomInput
                                label="Description"
                                value={description}
                                setValue={setDescription}
                                submitted={submitted}
                                required={true}
                            />
                        </div>
                    </div>
                    <SubmitLoading isLoading={isLoading} value={[title, description]} />
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

export default UpdateShipping;
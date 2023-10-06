"use client"
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import axios from 'axios';
import CustomInput from '@/components/Common/CustomInput';
import SubmitLoading from '@/components/Common/SubmitLoading';
import CreateModalButton from '@/components/Common/(Button)/CreateModalButton';
import CustomInputNumber from '@/components/Common/CustomInputNumber';


const CreateShipping = ({ refetch }: { refetch: () => void }) => {

    const [dialog, setDialog] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [cost, setCost] = useState<number>(0);
    const [description, setDescription] = useState<string>("");

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    const saveHandler = async (e: any) => {

        e.preventDefault();
        setSubmitted(true);
        setIsLoading(true);

        try {

            const { data } = await axios.post("/api/admin/shipping",
                {
                    title,
                    cost,
                    description,
                },
            );
            if (data?.status) {
                toast.current?.show({
                    severity: "success",
                    detail: `${data?.message}`,
                    life: 1000,
                });

                refetch();
                setTitle("");
                setDescription("");
                setCost(0);
                setDialog(false);
                setSubmitted(false);
                setIsLoading(false);

            } else {
                toast.current?.show({
                    severity: "error",
                    detail: `${data?.message}`,
                    life: 3000,
                });
                setSubmitted(false);
                setIsLoading(false);
            }

        } catch (error) {
            console.error(error);
        }

        setIsLoading(false);
    };


    const handleHide = () => {
        setDialog(false)
        setTitle("");
        setCost(0);
        setDescription("");
    }


    return (
        <>
            <Toast ref={toast} />

            <CreateModalButton setDialog={setDialog} />

            <Dialog
                visible={dialog}
                style={{ width: "450px" }}
                header="Create Shipping"
                modal
                className="p-fluid"
                onHide={handleHide}
            >
                <form onSubmit={saveHandler}>
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
                    <SubmitLoading
                        isLoading={isLoading}
                        value={[title, cost, description]}
                    />
                </form>
            </Dialog>
        </>
    );
};

export default CreateShipping;
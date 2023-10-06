"use client"
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import axios from 'axios';
import CustomInput from '@/components/Common/CustomInput';
import SubmitLoading from '@/components/Common/SubmitLoading';
import CreateModalButton from '@/components/Common/(Button)/CreateModalButton';
import CustomInputNumber from '@/components/Common/CustomInputNumber';
import CustomDropDown from '@/components/Common/CustomDropDown';
import { InputSwitch } from 'primereact/inputswitch';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';


const CreateCoupon = ({ refetch }: { refetch: () => void }) => {

    const [dialog, setDialog] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [discount, setDiscount] = useState<number>(0);
    const [type, setType] = useState<{ name: string } | null>(null);
    const [status, setStatus] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);


    const saveHandler = async (e: any) => {

        e.preventDefault();
        setSubmitted(true);
        setIsLoading(true);

        try {

            const { data } = await axios.post("/api/admin/coupons",
                {
                    title,
                    discount,
                    type: type?.name,
                    status
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
                setDiscount(0);
                setType(null);
                setStatus(false);
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
        setDiscount(0);
        setType(null);
        setStatus(false);
        setDialog(false);
    }


    const discountOptions: any = {
        data: [{ name: "Taka" }, { name: "Percent" }]
    }



    return (
        <>
            <Toast ref={toast} />

            <CreateModalButton setDialog={setDialog} />

            <Dialog
                visible={dialog}
                style={{ width: "450px" }}
                header="Create Coupon"
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
                                required={true}
                                focus={true}
                                setValue={setTitle}
                                submitted={submitted}
                            />
                        </div>
                        <div className="field col-12">
                            <CustomInputNumber
                                label="Discount"
                                value={discount}
                                required={true}
                                setValue={setDiscount}
                                submitted={submitted}
                            />
                        </div>

                        <div className="field col-12">
                            <CustomDropDown
                                label="Discount Type"
                                data={discountOptions}
                                placeholder='Selected Type'
                                value={type}
                                setValue={setType}
                                optionSelected='name'
                                required={true}
                                submitted={submitted}
                            />
                        </div>

                        <div className='field col-12 flex gap-3 justify-content-end'>
                            <label htmlFor="active">STATUS</label>
                            <InputSwitch id="active" checked={status} onChange={(e: any) => setStatus(e.value)} />
                        </div>
                    </div>


                    <div style={{ marginTop: "30px" }}>
                        {isLoading && (
                            <ProgressBar
                                mode="indeterminate"
                                color='success'
                                style={{ height: "6px", width: "300px", margin: "30px auto" }}
                            />
                        )}
                        <Button
                            disabled={!title || !discount || !type}
                            type="submit"
                            severity="success"
                            label="SUBMIT"
                            size='small'
                            className="mt-10 p-2"
                        />
                    </div>


                </form>
            </Dialog>
        </>
    );
};

export default CreateCoupon;
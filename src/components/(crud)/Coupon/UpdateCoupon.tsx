"use client"
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { ICategory, ICouponType } from '@/types/common';
import CustomInput from '@/components/Common/CustomInput';
import SubmitLoading from '@/components/Common/SubmitLoading';
import UpdateModalButton from '@/components/Common/(Button)/UpdateModalButton';
import UploadSingleImage from '@/components/Shared/UploadSingleImage';
import SingleImageRow from '@/components/Shared/SingleImageRow';
import { InputSwitch } from 'primereact/inputswitch';
import CustomDropDown from '@/components/Common/CustomDropDown';
import CustomInputNumber from '@/components/Common/CustomInputNumber';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';


const UpdateCoupon = ({ rowSelected, refetch, setRowSelected }:
    {
        rowSelected: ICouponType[] | null,
        setRowSelected: any,
        refetch: () => void
    }) => {

    const [dialog, setDialog] = useState<boolean>(false);
    const [id, setId] = useState(null);
    const [title, setTitle] = useState<string>("");
    const [discount, setDiscount] = useState<number>(0);
    const [type, setType] = useState<any>(null);
    const [status, setStatus] = useState<boolean>(false);

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);



    const updateHandler = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setSubmitted(true);

        try {

            const { data } = await axios.patch(
                "/api/admin/coupons",
                {
                    id,
                    title,
                    discount,
                    type: type?.name,
                    status
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
        setDiscount(rowData[0].discount);
        setType(rowData[0].type);
        setStatus(rowData[0].status);
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
                header="Update Coupon"
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
                            <label htmlFor="type">Discount Type</label>

                            <InputText
                                id="type"
                                value={type}
                                onChange={(e: any) => setType(e.value)}
                                disabled
                            />
                        </div>

                        <div className='field col-12 gap-2 flex justify-content-end'>
                            <label htmlFor="active">STATUS</label>
                            <InputSwitch checked={status} onChange={(e: any) => setStatus(e.value)} />
                        </div>
                    </div>
                    <SubmitLoading
                        isLoading={isLoading}
                        value={[title, discount, type]}
                    />
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

export default UpdateCoupon;
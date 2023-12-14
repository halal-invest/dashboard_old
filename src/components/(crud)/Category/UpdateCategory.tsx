"use client"
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { ICategory } from '@/types/common';
import CustomInput from '@/components/Common/CustomInput';
import SubmitLoading from '@/components/Common/SubmitLoading';
import UpdateModalButton from '@/components/Common/(Button)/UpdateModalButton';
import UploadSingleImage from '@/components/Shared/UploadSingleImage';
import SingleImageRow from '@/components/Shared/SingleImageRow';
import { URL } from '@/utils/constants';


const UpdateCategory = ({ rowSelected, setRowSelected }:
    {
        rowSelected: ICategory[] | null,
        setRowSelected: any;
    }) => {

    const [dialog, setDialog] = useState<boolean>(false);
    const [id, setId] = useState(null);
    const [title, setTitle] = useState<string>("");
    const [slug, setSlug] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);


    const updateHandler = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setSubmitted(true);

        try {

            const { data } = await axios.patch(
                `${URL}/api/admin/category`,
                {
                    id,
                    title,
                    slug,
                    imageUrl
                },
            );

            if (data.status) {
                toast.current?.show({
                    severity: "success",
                    detail: `${data.message}`,
                    life: 3000,
                });

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
        setSlug(rowData[0].slug);
        setTitle(rowData[0].title);
        if (rowData[0].media !== null) {
            setImageUrl(rowData[0].media?.url);
        }
        else {
            setImageUrl("")
        }
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
                header="Update Category"
                modal
                className="p-fluid"
                onHide={handleHide}
            >
                <form onSubmit={updateHandler}>
                    <div>

                        {
                            imageUrl === "" ?
                                <div className="field col-12">
                                    <UploadSingleImage value={imageUrl} setValue={setImageUrl} />
                                </div>
                                :
                                <SingleImageRow setValue={setImageUrl} url={imageUrl} />
                        }
                        <div className="field col-12">
                            <CustomInput
                                label="Title"
                                value={title}
                                focus={true}
                                setValue={setTitle}
                                submitted={submitted}
                            />
                        </div>
                        <div className="field col-12">
                            <CustomInput
                                label="Slug"
                                value={slug}
                                setValue={setSlug}
                                submitted={submitted}
                            />
                        </div>
                    </div>
                    <SubmitLoading isLoading={isLoading} value={[title]} />
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

export default UpdateCategory;
"use client"
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import CustomInput from '@/components/Common/CustomInput';
import SubmitLoading from '@/components/Common/SubmitLoading';
import { ICategory } from '@/types/common';
import CreateModalButton from '@/components/Common/(Button)/CreateModalButton';
import UploadSingleImage from '@/components/Shared/UploadSingleImage';
import SingleImageRow from '@/components/Shared/SingleImageRow';

interface IProps {
    refetch: () => void
    category: ICategory
}


const CreateSubCategory = ({ refetch, category }: IProps) => {

    const [dialog, setDialog] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [slug, setSlug] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");
    const [categoryId, setCategoryId] = useState<number | null>(null);

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        setCategoryId(category?.id);
    }, [category])

    const saveHandler = async (e: any) => {

        e.preventDefault();
        setSubmitted(true);
        setIsLoading(true);

        try {

            const { data } = await axios.post("/api/admin/sub-category",
                {
                    title,
                    image: imageUrl,
                    categoryId
                },
            );
            if (data?.status) {
                toast.current?.show({
                    severity: "success",
                    detail: `${data?.message}`,
                    life: 3000,
                });

                refetch();
                setTitle("");
                setImageUrl("");
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
        setImageUrl("");
    }

    return (
        <>
            <Toast ref={toast} />

            <CreateModalButton setDialog={setDialog} />

            <Dialog
                visible={dialog}
                style={{ width: "400px" }}
                header="Create Category"
                modal
                className="p-fluid"
                onHide={handleHide}
            >
                <form onSubmit={saveHandler}>
                    <div>
                        {
                            imageUrl == "" ?
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
                    </div>

                    <SubmitLoading isLoading={isLoading} value={[title, imageUrl]} />
                </form>
            </Dialog>
        </>
    );
};

export default CreateSubCategory;
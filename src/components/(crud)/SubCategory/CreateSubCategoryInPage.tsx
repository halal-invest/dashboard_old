"use client"
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import CustomInput from '@/components/Common/CustomInput';
import SubmitLoading from '@/components/Common/SubmitLoading';
import { ICategory, ICreateCategoryItemType } from '@/types/common';
import CreateModalButton from '@/components/Common/(Button)/CreateModalButton';
import CustomDropDown from '@/components/Common/CustomDropDown';
import UploadSingleImage from '@/components/Shared/UploadSingleImage';
import SingleImageRow from '@/components/Shared/SingleImageRow';
import { Button } from 'primereact/button';


interface IProps {
    categories: ICreateCategoryItemType[];
    refreshData?: any;
}


const CreateSubCategoryInPage = ({ categories, refreshData }: IProps) => {

    const [dialog, setDialog] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [slug, setSlug] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");
    const [category, setCategory] = useState<ICreateCategoryItemType | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);



    const saveHandler = async (e: any) => {

        e.preventDefault();
        setSubmitted(true);
        setIsLoading(true);

        try {

            const { data } = await axios.post("/api/admin/sub-category",
                {
                    title,
                    slug,
                    imageUrl,
                    categoryId: category?.id
                },
            );
            if (data?.status) {
                toast.current?.show({
                    severity: "success",
                    detail: `${data?.message}`,
                    life: 3000,
                });
                refreshData();
                setTitle("");
                setSlug("");
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
        setSlug("");
        setImageUrl("");
        setCategory(null);
    }

    return (
        <>
            <Toast ref={toast} />

            <CreateModalButton setDialog={setDialog} />

            <Dialog
                visible={dialog}
                style={{ width: "600px" }}
                header="Create Sub Category"
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
                                setValue={setTitle}
                                submitted={submitted}
                                required={true}
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

                        <div className="field col-12">
                            <CustomDropDown
                                label="Category"
                                value={category}
                                data={categories}
                                optionSelected='title'
                                placeholder='Select a category'
                                setValue={setCategory}
                                submitted={submitted}
                                required={true}
                            />
                        </div>
                        <div style={{ marginTop: "30px" }}>
                            <Button
                                disabled={!title || !category}
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
        </>
    );
};

export default CreateSubCategoryInPage;
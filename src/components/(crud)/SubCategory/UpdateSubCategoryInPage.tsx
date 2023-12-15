"use client"
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { ICreateCategoryItemType, IGetSubCategoriesItemType } from '@/types/common';
import CustomInput from '@/components/Common/CustomInput';
import UpdateModalButton from '@/components/Common/(Button)/UpdateModalButton';
import CustomDropDown from '@/components/Common/CustomDropDown';
import UploadSingleImage from '@/components/Shared/UploadSingleImage';
import SingleImageRow from '@/components/Shared/SingleImageRow';
import { Button } from 'primereact/button';

interface IProps {
    rowSelected: IGetSubCategoriesItemType[];
    setRowSelected: any,
    categories: ICreateCategoryItemType[];
    refreshData: any;
}

const UpdateSubCategoryInPage = ({ rowSelected, setRowSelected, categories, refreshData }: IProps) => {

    const [dialog, setDialog] = useState<boolean>(false);
    const [id, setId] = useState<number | null>(null);
    const [title, setTitle] = useState<string>("");
    const [slug, setSlug] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");
    const [category, setCategory] = useState<any | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);


    const updateHandler = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setSubmitted(true);

        try {

            const { data } = await axios.patch(
                "/api/admin/sub-category",
                {
                    id,
                    title,
                    slug,
                    imageUrl,
                    categoryId: category?.id
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

    const confirmUpdate = (rowData: IGetSubCategoriesItemType[]) => {
        setDialog(true);
        setId(rowData[0].id)
        setTitle(rowData[0].title);
        setCategory(rowData[0].category);
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
                header="Update Sub Category"
                modal
                className="p-fluid"
                onHide={handleHide}
            >
                <form onSubmit={updateHandler}>
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
                            />
                        </div>

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

export default UpdateSubCategoryInPage;
"use client"
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { ISubCategory } from '@/types/common';
import CustomInput from '@/components/Common/CustomInput';
import SubmitLoading from '@/components/Common/SubmitLoading';
import UpdateModalButton from '@/components/Common/(Button)/UpdateModalButton';
import CustomDropDown from '@/components/Common/CustomDropDown';
import { useQuery } from '@tanstack/react-query';
import UploadSingleImage from '@/components/Shared/UploadSingleImage';
import SingleImageRow from '@/components/Shared/SingleImageRow';

interface IProps {
    rowSelected: ISubCategory[]
    setRowSelected: any,
    refetch: () => void
}

const UpdateSubCategoryInPage = ({ rowSelected, refetch, setRowSelected }: IProps) => {

    const [dialog, setDialog] = useState<boolean>(false);
    const [id, setId] = useState<number | null>(null);
    const [title, setTitle] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [category, setCategory] = useState<any | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);


    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => await axios.get("/api/admin/category")
    });


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
                    image,
                    categoryId: category?.id
                },
            );

            if (data.status) {
                toast.current?.show({
                    severity: "success",
                    detail: `${data.message}`,
                    life: 3000,
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

    const confirmUpdate = (rowData: ISubCategory[]) => {
        setDialog(true);
        setId(rowData[0].id)
        setTitle(rowData[0].title);
        setImage(rowData[0].image);
        setCategory(rowData[0].category);
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
                header="Update Sub Category"
                modal
                className="p-fluid"
                onHide={handleHide}
            >
                <form onSubmit={updateHandler}>
                    <div>
                        {
                            image == "" ?
                                <div className="field col-12">
                                    <UploadSingleImage value={image} setValue={setImage} />
                                </div>
                                :
                                <SingleImageRow setValue={setImage} url={image} />
                        }

                        <div className="field col-12">
                            <CustomInput
                                label="Title"
                                value={title}
                                setValue={setTitle}
                                submitted={submitted}
                            />
                        </div>

                        <div className="field col-12">
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
                    </div>
                    <SubmitLoading isLoading={isLoading} value={[title, image, category]} />
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
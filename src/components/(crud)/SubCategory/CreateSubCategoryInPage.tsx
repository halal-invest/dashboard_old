"use client"
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import CustomInput from '@/components/Common/CustomInput';
import SubmitLoading from '@/components/Common/SubmitLoading';
import { ICategory } from '@/types/common';
import CreateModalButton from '@/components/Common/(Button)/CreateModalButton';
import { useQuery } from '@tanstack/react-query';
import CustomDropDown from '@/components/Common/CustomDropDown';

interface IProps {
    refetch: () => void
}

interface ISelectCategory {
    id: number
    title: string;
    slug: string;
    image: string;
}


const CreateSubCategoryInPage = ({ refetch }: IProps) => {

    const [dialog, setDialog] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [category, setCategory] = useState<ISelectCategory | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    const { data: categories, isLoading: categoryLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => await axios.get("/api/admin/category")
    });


    const saveHandler = async (e: any) => {

        e.preventDefault();
        setSubmitted(true);
        setIsLoading(true);

        try {

            const { data } = await axios.post("/api/admin/sub-category",
                {
                    title,
                    image,
                    categoryId: category?.id
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
                setImage("");
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
        setImage("");
        setCategory(null);
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
                        <div className="field col-12">
                            <CustomInput
                                label="Image"
                                value={image}
                                focus={true}
                                setValue={setImage}
                                submitted={submitted}
                            />
                        </div>
                        <div className="field col-12">
                            <CustomInput
                                label="Title"
                                value={title}
                                setValue={setTitle}
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
                        <SubmitLoading isLoading={isLoading} value={[title, image, category]} />
                    </div>

                </form>
            </Dialog>
        </>
    );
};

export default CreateSubCategoryInPage;
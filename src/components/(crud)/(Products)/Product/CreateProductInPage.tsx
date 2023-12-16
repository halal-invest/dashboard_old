"use client"
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import axios from 'axios';
import CustomInput from '@/components/Common/CustomInput';
import { ICreateCategoryItemType, ICreateSubCategoryItemType } from '@/types/common';
import CreateModalButton from '@/components/Common/(Button)/CreateModalButton';
import CustomDropDown from '@/components/Common/CustomDropDown';
import UploadSingleImage from '@/components/Shared/UploadSingleImage';
import SingleImageRow from '@/components/Shared/SingleImageRow';
import { Button } from 'primereact/button';


interface IProps {
    subCategories: ICreateSubCategoryItemType[];
    subSubCategories: ICreateSubCategoryItemType[];
    refreshData: any;
}


const CreateProductInPage = ({ subCategories, subSubCategories, refreshData }: IProps) => {

    const [dialog, setDialog] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [slug, setSlug] = useState<string>("");
    const [sku, setSku] = useState<string>("");
    const [season, setSeason] = useState<string>("");
    const [subCategory, setSubCategory] = useState<ICreateSubCategoryItemType | null>(null);
    const [subSubCategory, setSubSubCategory] = useState<ICreateCategoryItemType | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    const saveHandler = async (e: any) => {
        e.preventDefault();
        setSubmitted(true);
        setIsLoading(true);
        try {

            const { data } = await axios.post("/api/admin/product",
                {
                    title,
                    slug,
                    sku,
                    season,
                    subCategoryId: subCategory?.id,
                    subSubCategoryId: subSubCategory?.id,
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
                setSku("")
                setSubCategory(null);
                setSubSubCategory(null);
                setSubmitted(false);
                setIsLoading(false);
                setDialog(false);

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
        setSku("");
        setSubCategory(null);
        setSubSubCategory(null);
    }


    return (
        <>
            <Toast ref={toast} />

            <CreateModalButton setDialog={setDialog} />

            <Dialog
                visible={dialog}
                style={{ width: "800px" }}
                header="Create Product"
                modal
                className="p-fluid"
                onHide={handleHide}
            >
                <form onSubmit={saveHandler}>
                    <div>
                        <div className='formgrid grid col-12'>
                            <div className="field col-12 md:col">
                                <CustomInput
                                    label="TITLE"
                                    value={title}
                                    setValue={setTitle}
                                    submitted={submitted}
                                    required={true}
                                />
                            </div>
                            <div className="field col-12 md:col">
                                <CustomInput
                                    label="SLUG"
                                    value={slug}
                                    setValue={setSlug}
                                    submitted={submitted}
                                />
                            </div>
                        </div>

                        <div className='formgrid grid col-12'>
                            <div className="field col-12 md:col">
                                <CustomInput
                                    label="SKU"
                                    value={sku}
                                    setValue={setSku}
                                    submitted={submitted}
                                />
                            </div>

                            <div className="field col-12 md:col">
                                <CustomInput
                                    label="SEASON"
                                    value={season}
                                    setValue={setSeason}
                                    submitted={submitted}
                                />
                            </div>
                        </div>

                        <div className='formgrid grid col-12'>
                            {
                                !subSubCategory && <div className="field col-12 md:col">
                                    <CustomDropDown
                                        label="SUB CATEGORY"
                                        value={subCategory}
                                        data={subCategories}
                                        optionSelected='title'
                                        placeholder='Select a Sub category'
                                        setValue={setSubCategory}
                                        submitted={submitted}
                                        reset={true}
                                    />
                                </div>
                            }
                            {
                                !subCategory && <div className="field col-12 md:col">
                                    <CustomDropDown
                                        label="SUB SUB CATEGORY"
                                        value={subSubCategory}
                                        data={subSubCategories}
                                        optionSelected='title'
                                        placeholder='Select a Sub Sub Category'
                                        setValue={setSubSubCategory}
                                        submitted={submitted}
                                        reset={true}
                                    />
                                </div>
                            }
                        </div>




                        <div style={{ marginTop: "30px" }}>
                            <Button
                                disabled={!title || (!subCategory && !subSubCategory)}
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

export default CreateProductInPage;
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { ICreateCategoryItemType, ICreateSubCategoryItemType, IGetProductsItemsTypes } from '@/types/common';
import CustomInput from '@/components/Common/CustomInput';
import UpdateModalButton from '@/components/Common/(Button)/UpdateModalButton';
import CustomDropDown from '@/components/Common/CustomDropDown';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';

interface IProps {
    rowSelected: IGetProductsItemsTypes[];
    setRowSelected: any,
    subCategories: ICreateSubCategoryItemType[];
    subSubCategories: ICreateSubCategoryItemType[];
    refreshData: any;
}

const UpdateProductInPage = ({ rowSelected, setRowSelected, subCategories, subSubCategories, refreshData }: IProps) => {

    const [dialog, setDialog] = useState<boolean>(false);
    const [id, setId] = useState<number | null>(null);
    const [title, setTitle] = useState<string>("");
    const [slug, setSlug] = useState<string>("");
    const [sku, setSku] = useState<string>("");
    const [season, setSeason] = useState<string>("");
    const [isActive, setIsActive] = useState<boolean>(true);
    const [subCategory, setSubCategory] = useState<ICreateSubCategoryItemType | null>(null);
    const [subSubCategory, setSubSubCategory] = useState<ICreateCategoryItemType | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);


    const updateHandler = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setSubmitted(true);
        try {
            const { data } = await axios.patch(
                "/api/admin/product",
                {
                    id,
                    title,
                    slug,
                    sku,
                    season,
                    isActive,
                    subCategoryId: subCategory ? subCategory?.id : subCategory,
                    subSubCategoryId: subSubCategory ? subSubCategory?.id : subSubCategory,
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

    const confirmUpdate = (rowData: IGetProductsItemsTypes[]) => {
        const { id, title, isActive, season, sku, subCategory, subSubCategory } = rowData[0];
        setDialog(true);
        setId(id)
        setTitle(title);
        setIsActive(isActive);
        setSubCategory(subCategory);
        setSubSubCategory(subSubCategory);

        if (season) setSeason(season);
        else setSeason("");

        if (sku) setSku(sku);
        else setSku("");
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
                style={{ width: "800px" }}
                header="Update Product"
                modal
                className="p-fluid"
                onHide={handleHide}
            >
                <form onSubmit={updateHandler}>
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
                            <div className="field col-12 md:col">
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

                            <div className="field col-12 md:col">
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
                        </div>

                        <div className='field col-12 flex align-content-center gap-2 justify-content-end'>
                            <label htmlFor="active"> ACTIVE </label>
                            <InputSwitch checked={isActive} onChange={(e: any) => setIsActive(e.value)} />
                        </div>

                        <div style={{ marginTop: "20px" }}>
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

            <UpdateModalButton
                data={rowSelected}
                confirmUpdate={confirmUpdate}
                disabled={rowSelected?.length !== 1}
            />
        </>

    );
};

export default UpdateProductInPage;
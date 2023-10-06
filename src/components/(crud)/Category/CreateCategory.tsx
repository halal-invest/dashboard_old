"use client"
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import axios from 'axios';
import CustomInput from '@/components/Common/CustomInput';
import SubmitLoading from '@/components/Common/SubmitLoading';
import CreateModalButton from '@/components/Common/(Button)/CreateModalButton';
import UploadSingleImage from '@/components/Shared/UploadSingleImage';
import { Image } from 'primereact/image';
import SingleImageRow from '@/components/Shared/SingleImageRow';


const CreateCategory = ({ refetch }: { refetch: () => void }) => {

    const [dialog, setDialog] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [image, setImage] = useState<string>("");

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const toast = useRef<Toast>(null);

    const saveHandler = async (e: any) => {

        e.preventDefault();
        setSubmitted(true);
        setIsLoading(true);

        try {

            const { data } = await axios.post("/api/admin/category",
                {
                    title,
                    image,
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
    }

    return (
        <>
            <Toast ref={toast} />

            <CreateModalButton setDialog={setDialog} />

            <Dialog
                visible={dialog}
                style={{ width: "450px" }}
                header="Create Category"
                modal
                className="p-fluid"
                onHide={handleHide}
            >
                <form onSubmit={saveHandler}>
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
                                focus={true}
                                setValue={setTitle}
                                submitted={submitted}
                            />
                        </div>
                    </div>
                    <SubmitLoading
                        isLoading={isLoading}
                        value={[title, image]}
                    />
                </form>
            </Dialog>
        </>
    );
};

export default CreateCategory;
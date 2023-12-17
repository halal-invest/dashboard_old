import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import axios from 'axios';
import CustomInput from '@/components/Common/CustomInput';
import CreateModalButton from '@/components/Common/(Button)/CreateModalButton';
import { Button } from 'primereact/button';

interface IProps {
    refreshData: any;
}


const CreateSize = ({ refreshData }: IProps) => {

    const [dialog, setDialog] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    const saveHandler = async (e: any) => {
        e.preventDefault();
        setSubmitted(true);
        setIsLoading(true);
        try {

            const { data } = await axios.post("/api/admin/size",
                {
                    title,
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
    }


    return (
        <>
            <Toast ref={toast} />

            <CreateModalButton setDialog={setDialog} />

            <Dialog
                visible={dialog}
                style={{ width: "600px" }}
                header="Create Product"
                modal
                className="p-fluid"
                onHide={handleHide}
            >
                <form onSubmit={saveHandler}>
                    <div>
                        <div className="field col-12 md:col">
                            <CustomInput
                                label="TITLE"
                                value={title}
                                setValue={setTitle}
                                submitted={submitted}
                                required={true}
                            />
                        </div>

                        <div style={{ marginTop: "30px" }}>
                            <Button
                                disabled={!title}
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

export default CreateSize;
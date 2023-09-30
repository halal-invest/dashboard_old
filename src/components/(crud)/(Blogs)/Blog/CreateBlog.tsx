"use client"
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import axios from 'axios';
import CustomInput from '@/components/Common/CustomInput';
import CreateModalButton from '@/components/Common/(Button)/CreateModalButton';
import UploadSingleImage from '@/components/Shared/UploadSingleImage';
import SingleImageRow from '@/components/Shared/SingleImageRow';
import { ISubBlogs } from '@/types/common';
import CustomDropDown from '@/components/Common/CustomDropDown';
import CustomEditorInput from '@/components/Common/CustomEditorInput';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';


const CreateBlog = ({ refetch, subBlogData }: { refetch: () => void, subBlogData: any }) => {

    const [dialog, setDialog] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [author, setAuthor] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [subBLog, setSubBlog] = useState<ISubBlogs | null>(null);

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const toast = useRef<Toast>(null);

    const saveHandler = async (e: any) => {

        e.preventDefault();
        setSubmitted(true);
        setIsLoading(true);

        try {

            const { data } = await axios.post("/api/admin/blogs",
                {
                    title,
                    image,
                    author,
                    subBLogId: subBLog?.id,
                    content,
                },
            );
            if (data?.status) {
                toast.current?.show({
                    severity: "success",
                    detail: `${data?.message}`,
                    life: 1000,
                });

                refetch();
                setTitle("");
                setImage("");
                setContent("")
                setAuthor("");
                setSubBlog(null);
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
        setDialog(false);
        setTitle("");
        setImage("");
        setContent("")
        setAuthor("");
        setSubBlog(null);
    }

    return (
        <>
            <Toast ref={toast} />

            <CreateModalButton setDialog={setDialog} />

            <Dialog
                visible={dialog}
                style={{ width: "800px" }}
                header="Create Blog"
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
                        <div className='formgrid grid col-12'>
                            <div className="field col-12 md:col">
                                <CustomInput
                                    label="Author"
                                    value={author}
                                    setValue={setAuthor}
                                    submitted={submitted}
                                />
                            </div>
                            <div className="field col-12 md:col">
                                <CustomDropDown
                                    label='Sub BLog'
                                    submitted={submitted}
                                    data={subBlogData}
                                    value={subBLog}
                                    placeholder='Select sub blog'
                                    setValue={setSubBlog}
                                    optionSelected="title"
                                />
                            </div>
                        </div>

                        <div className="field col-12">
                            <CustomEditorInput
                                label='Content'
                                height='320px'
                                value={content}
                                setValue={setContent}
                                submitted={submitted}
                                require={true}
                            />
                        </div>
                    </div>
                    <div style={{ marginTop: "30px" }}>
                        {isLoading && (
                            <ProgressBar
                                mode="indeterminate"
                                color='success'
                                style={{ height: "6px", width: "300px", margin: "30px auto" }}
                            />
                        )}
                        <Button
                            disabled={!title || !image || !author || !subBLog || !content}
                            type="submit"
                            severity="success"
                            label="SUBMIT"
                            size='small'
                            className="mt-10 p-2"
                        />
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default CreateBlog;
"use client"
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { IBlogsInclude, ICategory, ISubBlogs } from '@/types/common';
import CustomInput from '@/components/Common/CustomInput';
import SubmitLoading from '@/components/Common/SubmitLoading';
import UpdateModalButton from '@/components/Common/(Button)/UpdateModalButton';
import UploadSingleImage from '@/components/Shared/UploadSingleImage';
import SingleImageRow from '@/components/Shared/SingleImageRow';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import CustomEditorInput from '@/components/Common/CustomEditorInput';
import CustomDropDown from '@/components/Common/CustomDropDown';


interface IProps {
    rowSelected: IBlogsInclude[] | null;
    setRowSelected: any;
    refetch: () => void;
    subBlogData: any
}

const UpdateBlog = ({ rowSelected, refetch, setRowSelected, subBlogData }: IProps) => {

    const [dialog, setDialog] = useState<boolean>(false);
    const [id, setId] = useState(null);
    const [title, setTitle] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [author, setAuthor] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [subBLog, setSubBlog] = useState<ISubBlogs | null>(null);

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);



    const updateHandler = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setSubmitted(true);

        try {

            const { data } = await axios.patch(
                "/api/admin/blogs",
                {
                    id,
                    title,
                    image,
                    author,
                    subBLogId: subBLog?.id,
                    content,
                },
            );

            if (data.status) {
                toast.current?.show({
                    severity: "success",
                    detail: `${data.message}`,
                    life: 1000,
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

    const confirmUpdate = (rowData: any) => {
        setDialog(true);
        setId(rowData[0].id)
        setTitle(rowData[0].title);
        setImage(rowData[0].image);
        setAuthor(rowData[0].author);
        setSubBlog(rowData[0].subBLog);
        setContent(rowData[0].content);

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
                header="Update Blog"
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

            <UpdateModalButton
                data={rowSelected}
                confirmUpdate={confirmUpdate}
                disabled={rowSelected?.length !== 1}
            />
        </>

    );
};

export default UpdateBlog;
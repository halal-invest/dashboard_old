"use client"
import React, { useRef, useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';


export default function UploadSingleImage({ setValue, value }: { setValue: any, value: string }) {

    const [file, setFile] = useState<any | null>(null);
    const toast = useRef<Toast>(null);

    const handelUpload = async (file: any, props: any) => {

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'j8mzxmh1');

        try {

            if (value !== "" ) {
                return toast.current?.show({
                    severity: 'error',
                    detail: "Already added images",
                    life: 1000,
                });
            }

            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/sajibclaudinaryname/image/upload',
                formData
            );

            if (response?.status === 200) {
                setValue(response?.data?.url);
                toast.current?.show({
                    severity: 'success',
                    detail: 'Image Upload successfully',
                    life: 500,
                });
                props.options.clear();
            }

        } catch (error) {
            console.error(error);
        }
    }

    const chooseOptions =
    {
        icon: 'pi pi-fw pi-images',
        iconOnly: true,
        className: 'custom-choose-btn p-button-rounded p-button-outlined px-3'
    };

    const uploadOptions = {
        icon: 'pi pi-fw pi-cloud-upload',
        iconOnly: true,
        className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined px-3'
    };

    const cancelOptions =
    {
        icon: 'pi pi-fw pi-times',
        iconOnly: true,
        className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined px-3',
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column" style={{ height: "30px" }}>
                <i className="pi pi-image"
                    style={{
                        fontSize: '2em',
                        borderRadius: '50%',
                        backgroundColor: 'var(--surface-b)',
                        color: 'var(--surface-d)'
                    }} />
                <span style={{ fontSize: '1em', color: 'var(--text-color-secondary)' }} className="my-1">
                    Drag and Drop Image Here
                </span>
            </div>
        );
    };


    const onTemplateRemove = (fileLabt: any, callback: any) => {
        callback()
    };

    const itemTemplate = (file: any, props: any) => {

        return (
            <div className="flex align-items-center h-3rem ">
                <Toast ref={toast} />
                <div className="flex align-items-center" >
                    <img style={{ borderRadius: "50%", width: "60px", height: "60px" }} alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-column text-left mr-2 ml-3">
                        {file?.name?.substring(1, 8)}
                        {/* <small>{new Date().toLocaleDateString()}</small> */}
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button 
                type="button"
                 size='small' 
                 icon="pi pi-times"
                  className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };


    return (
        <div className="" >
            <Toast ref={toast} />
            <FileUpload
                name="demo[]"
                onSelect={(e) => setFile(e?.files[0])}
                customUpload
                uploadHandler={(data) => handelUpload(file, data)}
                onClear={() => setFile(null)}
                accept="image/*"
                onRemove={() => setFile(null)}
                cancelOptions={cancelOptions}
                chooseOptions={chooseOptions}
                uploadOptions={uploadOptions}
                itemTemplate={itemTemplate}
                maxFileSize={500000}
                emptyTemplate={emptyTemplate}

            />
        </div>

    )
}
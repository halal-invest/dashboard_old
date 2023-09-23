"use client"

import React, { useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import axios from 'axios';



export default function UploadImage({ setValue }: { setValue: any }) {

    const [file, setFile] = useState<any | null>(null);


    const handelUpload = async () => {

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ytpmzows');

        try {
            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/dymnymsph/image/upload',
                formData
            );
            if (response?.status === 200) {
                setValue(response?.data?.url)
                setFile(null);
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
        className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined px-3'
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column" style={{ height: "70px" }}>
                <i className="pi pi-image p-3 "
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


    return (
        <div className="" >
            <FileUpload
                name="demo[]"
                onSelect={(e) => setFile(e?.files[0])}
                customUpload
                uploadHandler={handelUpload}
                onClear={() => setFile(null)}
                accept="image/*"
                cancelOptions={cancelOptions}
                chooseOptions={chooseOptions}
                uploadOptions={uploadOptions}
                maxFileSize={500000}
                emptyTemplate={emptyTemplate}
            />
        </div>

    )
}

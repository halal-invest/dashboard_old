import axios from 'axios';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import React, { useRef } from 'react';
import crypto from "crypto";
import { Toast } from 'primereact/toast';

interface IProps {
    url: string;
    setValue: any;
}

const generateSHA1 = (data: any) => {
    const hash = crypto.createHash("sha1");
    hash.update(data);
    return hash.digest("hex");
}

const generateSignature = (publicId: string, apiSecret: string) => {
    const timestamp = new Date().getTime();
    return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
};


const SingleImageRow = ({ url, setValue }: IProps) => {
    const toast = useRef<Toast>(null);

    const regex = /\/v\d+\/([^/]+)\.\w{3,4}$/;
    const match = url?.match(regex);
    const publicId: any = match ? match[1] : null;

    const cloudName = 'sajibclaudinaryname';
    const timestamp = new Date().getTime();
    const apiKey = '677897417368787';
    const apiSecret = 'Ec_jQH-T_d2sZJeBOUCtq2J1AkQ'
    const signature = generateSHA1(generateSignature(publicId, apiSecret));
    const URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;


    const handleRemove = async () => {
        try {

            setValue("");
            const response = await axios.post(URL, {
                public_id: publicId,
                signature: signature,
                api_key: apiKey,
                timestamp: timestamp,
            });
            if (response?.status === 200) {
                toast.current?.show({
                    severity: 'success',
                    detail: 'Image Removed successfully',
                    life: 3000,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='flex justify-content-center'>
            <Toast ref={toast} />
            <div >
                <Image src={url} alt="Image" width="100" height='80' preview />
                <div className='flex justify-content-start'>
                    <Button
                        label='Remove'
                        size='small'
                        text
                        severity="danger"
                        style={{ width: "100px", height: "5px" }}
                        onClick={handleRemove}
                    />
                </div>

            </div>
        </div>

    );
};

export default SingleImageRow;
"use client"
import CustomInput from '@/components/Common/CustomInput';
import SingleImageRow from '@/components/Shared/SingleImageRow';
import UploadSingleImage from '@/components/Shared/UploadSingleImage';
import SiteInfoSkeleton from '@/components/Skeleton/SiteInfoSkeleton ';
import useSiteInfo from '@/hooks/useSiteInfo';
import axios from 'axios';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';

const SiteInfoPage = () => {

    const [id, setId] = useState<number | null>(null);
    const [logo, setLogo] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    const { data, isLoading: siteLoading, error, refetch } = useSiteInfo();


    useEffect(() => {
        setId(data?.data?.id);
        setTitle(data?.data?.title);
        setEmail(data?.data?.email);
        setPhone(data?.data?.phone);
        setAddress(data?.data?.address);
        setDescription(data?.data?.description);
        if (data?.data?.logo === undefined) {
            setLogo("");
        }
        else {
            setLogo(data?.data?.logo);
        }
    }, [data?.data]);

    error && console.log("Fetch site info error: ", error);


    const handleSiteInfo = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setSubmitted(true);


        try {

            const { data } = await axios.put(
                "/api/admin/siteinfo",
                {
                    id,
                    logo,
                    title,
                    email,
                    phone,
                    address,
                    description
                },
            );

            if (data.status) {
                toast.current?.show({
                    severity: "success",
                    detail: `${data.message}`,
                    life: 1000,
                });
                refetch();
                setIsLoading(false);
                setSubmitted(false);


            } else {
                toast.current?.show({
                    severity: "error",
                    detail: `${data.message}`,
                    life: 3000,
                });
                setIsLoading(false);
                setSubmitted(false);

            }

        } catch (error) {
            console.log(error);
        }
    };




    return (
        <div>
            <Toast ref={toast} />
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <h5 className='text-center uppercase'>Site Information</h5>

                        {
                            siteLoading
                                ?
                                <SiteInfoSkeleton />
                                :
                                <form
                                    onSubmit={handleSiteInfo}
                                    className="flex flex-column gap-2"
                                >
                                    <div className="field flex justify-content-center">
                                        {
                                            logo == "" ?
                                                <div className="field col-5">
                                                    <UploadSingleImage value={logo} setValue={setLogo} />
                                                </div>
                                                :
                                                <SingleImageRow setValue={setLogo} url={logo} />
                                        }
                                    </div>

                                    <div className="p-fluid formgrid grid">
                                        <div className="field col-12 md:col-4">
                                            <CustomInput
                                                label='Title'
                                                value={title}
                                                setValue={setTitle}
                                                submitted={submitted}
                                            />
                                        </div>

                                        <div className="field col-12 md:col-4">
                                            <CustomInput
                                                label='Email'
                                                value={email}
                                                setValue={setEmail}
                                                submitted={submitted}
                                            />
                                        </div>
                                        <div className="field col-12 md:col-4">
                                            <CustomInput
                                                label='Phone'
                                                value={phone}
                                                setValue={setPhone}
                                                submitted={submitted}
                                            />
                                        </div>
                                        <div className="field col-12">

                                            <CustomInput
                                                label='address'
                                                value={address}
                                                setValue={setAddress}
                                                submitted={submitted}
                                            />
                                        </div>

                                        <div className="field col">
                                            <label htmlFor="des"> Description </label>
                                            <InputTextarea
                                                id='des'
                                                value={description}
                                                onChange={(e: any) => setDescription(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex justify-content-end' >
                                        <Button
                                            type="submit"
                                            severity="success"
                                            label={isLoading ? "LOADING..." : "SUBMIT"}
                                            raised
                                            size='small'
                                            className="p-1 px-2"
                                        />
                                    </div>

                                </form>
                        }

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiteInfoPage;
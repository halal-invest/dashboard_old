'use client';
import axios from 'axios';
import Image from 'next/image';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';
const Install = () => {
    const [email, setEmail] =useState('');
    const [password, setPassword] = useState('');
    const [isLoading,setIsLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const router = useRouter()
    
    const installHandler = async () =>{
        try{
            setIsLoading(true);
            const {data} = await axios.post("/api/install",{
                email:email,
                password:password
            });
            setIsLoading(false);
            if(data?.status){
                toast.current?.show({
                  severity: 'success',
                  summary: 'Success',
                  detail: `${data?.message}`,
                  life: 1000
              });
            }else{
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `${data?.message}`,
                    life: 1000
                });  
            }
            return data;
        }catch(error){
            console.log(error);
            return error;
            
        }
    }
    const install = async(e:any) => {
        e.preventDefault();
        const installationData = await installHandler();
        if(installationData.status){
            router.push('/auth/login');
        }
    } 

    return (
        <main>
            <Toast ref={toast} />
            <div className="card h-full">

                <div className="flex flex-column md:flex-column justify-content-center">
                    <div className="flex md:flex-row justify-content-center" >
                        <Image src="/Logo.png" alt="Image" width="100" height="35" />
                    </div>
                    <h4 className='text-center'>Excel Extensions Management Tool</h4>
                    <h3 className='text-center mt-0 pt-0' >Installation </h3>
                </div>
                <form onSubmit={install}>
                <div className="flex flex-column md:flex-row justify-content-center">
                    <div className="w-full md:w-4 flex flex-column align-items-s justify-content-center gap-3 py-5">
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-user"></i>
                            </span>
                            <InputText placeholder="Admin Email" name='email' id='email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        </div>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-key"></i>
                            </span>
                            <InputText placeholder="Admin Password" type= "password" name='password' id='password' value={password} onChange={(e)=>setPassword(e.target.value)}  />
                        </div>
                        <Button label={isLoading ? "Wait...": "Install"} icon="pi pi-user" className="w-8rem mx-auto"></Button>
                    </div>
                </div>
                </form>
            </div>
        </main>
    );
};

export default Install;
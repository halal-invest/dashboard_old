'use client';
import axios from 'axios';
import Image from 'next/image';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from "react-redux";

import { Toast } from 'primereact/toast';
import { redirect, useRouter } from 'next/navigation';
import { Password } from 'primereact/password';
import { loginSuccess } from '../../../../store/userSlice';
const Login = () => {
    const [email, setEmail] =useState('');
    const [password, setPassword] = useState('');
    const [isLoading,setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const toast = useRef<Toast>(null);
    const router = useRouter()
    const getApi = async()=>{
        const result = await axios("https://ip-address-xn83.onrender.com/getUserPrivateIpAddress");
        console.log(result.data.userPrivateIpAddress);
      }
      useEffect(()=>{
        getApi();
      },[])
    
    const loginHandler = async () =>{
        try{
            setIsLoading(true);
            const {data} = await axios.post("/api/login",{
                email:email,
                password:password
            });
            dispatch(loginSuccess(data?.user));
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
    const login = async(e:any) => {
        e.preventDefault();
        const loginData = await loginHandler();
        if(loginData.status){
            router.push('/');
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
                    <h4 className='text-center'>Excel Extensions Management System</h4>
                </div>
                <form onSubmit={login}>
                <div className="flex flex-column md:flex-row justify-content-center">
                    <div className="w-full md:w-4 flex flex-column align-items-s justify-content-center gap-3 py-5">
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-user"></i>
                            </span>
                            <InputText placeholder="Email" name='email' id='email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        </div>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-key"></i>
                            </span>
                            {/* <InputText type='password' placeholder="Password" name='password' id='password' value={password} onChange={(e)=>setPassword(e.target.value)}  /> */}
                            <Password value={password} placeholder='password' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} toggleMask />
                        </div>
                        <Button label={isLoading ? "Wait...": "Login"} icon="pi pi-user" className="w-8rem mx-auto py-2"></Button>
                    </div>
                </div>
                </form>
            </div>
        </main>
    );
};

export default Login;
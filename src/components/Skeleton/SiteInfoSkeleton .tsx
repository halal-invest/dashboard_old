"use client"

import { Skeleton } from 'primereact/skeleton';
import React from 'react';

const SiteInfoSkeleton = () => {

    return (
      
            <div className="border-round border-1 surface-border p-4 surface-card">
                <div className='flex justify-content-center mb-5' >
                    <Skeleton shape="circle" size="7rem"></Skeleton>
                </div>
                <div className="flex gap-5 mb-5">
                    <Skeleton className="mb-2" height="2rem" />
                    <Skeleton className="mb-2" height="2rem" />
                    <Skeleton className="mb-2" height="2rem" />
                </div>
                <Skeleton width="100%" height="3rem" className='mb-5' />
                <Skeleton width="100%" height="5rem" />
                <div className="flex justify-content-end mt-5">
                    <Skeleton width="4rem" height="2rem" />
                </div>
            </div>
       
    );
};

export default SiteInfoSkeleton;
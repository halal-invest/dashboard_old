"use client"
import UploadSingleImage from '@/components/Shared/UploadSingleImage';
import React, { useState } from 'react';

const BlogPage = () => {
    const [image, setImage] = useState<string>("")

    return (
        <div>
            <UploadSingleImage setValue={setImage} />
        </div>
    );
};

export default BlogPage;
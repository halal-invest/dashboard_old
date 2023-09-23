"use client"
import UploadImage from '@/components/Shared/UploadImage';
import React, { useState } from 'react';

const BlogPage = () => {
    const [image, setImage] = useState<string>("")

    return (
        <div>
            <UploadImage setValue={setImage} />
        </div>
    );
};

export default BlogPage;
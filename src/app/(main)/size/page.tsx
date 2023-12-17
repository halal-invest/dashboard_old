import MainContextSize from '@/components/(crud)/(Products)/Size';
import { getSizes } from '@/components/Fetcher/getSizes';
import React from 'react';

const SizePage = async () => {
    const sizes = await getSizes();
    return (
        <div>
            <MainContextSize sizes={sizes} />
        </div>
    );
};

export default SizePage;
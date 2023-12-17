import MainContextDeliveryCost from '@/components/(crud)/DeliveryCost';
import { getDeliveryCosts } from '@/components/Fetcher/getDeliveryCosts';
import React from 'react';

const DeliveryCostPage = async () => {
    const deliveryCosts = await getDeliveryCosts();
    return (
        <div>
            <MainContextDeliveryCost deliveryCosts={deliveryCosts} />
        </div>
    );
};

export default DeliveryCostPage;

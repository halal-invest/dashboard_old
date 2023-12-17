import MainContextPaymentMethod from '@/components/(crud)/(Payment)/PaymentMethod';
import { getPaymentMethods } from '@/components/Fetcher/getPaymentMethods';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'E-commerce || Payment Method',
    description: 'Safefoods - Your Trusted Online Marketplace for Fresh, Quality Ingredients. Explore a world of culinary delights with our diverse selection of safe and premium food products. Shop confidently for a healthier lifestyle at Safefoods!',
}

const PaymentMethodPage = async () => {
    const paymentMethods = await getPaymentMethods();
    return (
        <div>
            <MainContextPaymentMethod paymentMethods={paymentMethods} />
        </div>
    );
};

export default PaymentMethodPage;
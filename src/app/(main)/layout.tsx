import { Metadata } from 'next';
import Layout from '../../../layout/layout';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'E-commerce',
    description: "Shop the best deals online! Explore a wide range of products and enjoy secure, hassle-free shopping with fast delivery. Join us today!",
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    openGraph: {
        type: 'website',
        title: 'E-commerce',
        url: 'https://dashboard-theta-indol.vercel.app/',
        description: "Shop the best deals online! Explore a wide range of products and enjoy secure, hassle-free shopping with fast delivery. Join us today!",
        images: ['https://www.primefaces.org/static/social/sakai-react.png'],
        ttl: 604800
    },
    icons: {
        icon: '/favicon.ico'
    }
};

export default function AppLayout({ children }: AppLayoutProps) {
    return <Layout>{children}</Layout>;
}

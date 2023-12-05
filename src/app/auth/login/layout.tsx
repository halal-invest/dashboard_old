import { URL } from '@/utils/constants';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

interface AppLayoutProps {
    children: React.ReactNode;
}

const checkAdmin = async()=>{
    const res = await fetch(`${URL}/api/install`, 
    {cache:"no-store"}
    );
    return res.json()
}

export default async function AppLayout({ children }: AppLayoutProps) {
    const data = await checkAdmin();
    if(data.userCount >= 1){
        redirect('/auth/login');
    }
    return <div>{children}</div>;
}
import { useRouter } from 'next/navigation';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React from 'react';

interface IProps {
    title: string,
    data: any,
    setGlobalFilter: any
}

const TableHeader = ({ title, data, setGlobalFilter }: IProps) => {
    const router = useRouter();
    return (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">

            <Button
                onClick={() => router.back()}
                severity="success"
                rounded
                icon="pi pi-arrow-circle-left"
                text
            />

            <h6 className="m-0 uppercase flex align-items-center">
                <span className='text-green-500'> {title}  </span>
                <i  className="pi pi-arrow-right mx-2 " style={{ color: 'green' }} />
                <Badge
                    className="ml-2 pb-3"
                    value={data?.length}
                    size="normal"
                    severity="success"
                />
            </h6>

            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(e.currentTarget.value as any)}
                    placeholder="Search..."
                />
            </span>
        </div>
    );
};

export default TableHeader;
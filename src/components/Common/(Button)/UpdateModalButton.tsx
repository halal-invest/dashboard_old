import { Button } from 'primereact/button';
import React from 'react';

interface IProps {
    disabled?: boolean,
    confirmUpdate: any,
    data?: any,
}

const UpdateModalButton = ({ disabled, confirmUpdate, data }: IProps) => {
    return (
        <Button
            label="Update"
            disabled={disabled}
            size="small"
            raised
            severity="info"
            className="mr-2 p-2"
            onClick={() => confirmUpdate(data)}
        />
    );
};

export default UpdateModalButton;
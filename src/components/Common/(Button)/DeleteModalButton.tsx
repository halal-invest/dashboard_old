import { Button } from 'primereact/button';
import React from 'react';

interface IProps {
    disable: boolean,
    confirmDelete: any,
    data: any
}

const DeleteModalButton = ({ disable, confirmDelete, data }: IProps) => {
    return (
        <Button
            label='Delete'
            disabled={disable}
            raised
            severity="danger"
            size="small"
            className="mr-2 p-2"
            onClick={() => confirmDelete(data)}
        />
    );
};

export default DeleteModalButton;
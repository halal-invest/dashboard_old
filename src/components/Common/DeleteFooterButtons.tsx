import { Button } from 'primereact/button';
import React from 'react';

interface IProps {
    setDialog: any,
    deleteHandler: any
}

const DeleteFooterButtons = ({ setDialog, deleteHandler }: IProps) => {
    return (
        <>
            <Button
                label="Cancel"
                icon="pi pi-times"
                text
                onClick={() => setDialog(false)}
            />
            <Button
                label="Delete"
                icon="pi pi-check"
                text
                onClick={deleteHandler}
            />
        </>
    );
};

export default DeleteFooterButtons;
import { Button } from 'primereact/button';
import React from 'react';

interface IProps {
    setDialog: any
}

const CreateModalButton = ({ setDialog }: IProps) => {
    return (
        <Button
            label="Create"
            raised
            severity="success"
            className="mr-2 p-2"
            size="small"
            onClick={() => setDialog(true)}
        />
    );
};

export default CreateModalButton;
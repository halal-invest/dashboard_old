import React from 'react';

const ResetFormButton = ({ setHandler }: { setHandler: any }) => {
    return (
        <i
            className="pi pi-replay cursor-pointer"
            style={{ fontSize: '1.2rem', color: 'red', }}
            onClick={() => setHandler(null)}
        />
    );
};

export default ResetFormButton;
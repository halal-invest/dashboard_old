import { ProgressBar } from 'primereact/progressbar';
import React from 'react';

const DeleteConfirmContent = ({ select, isLoading }: {select:any, isLoading:boolean} ) => {
    return (
        <>
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3"
                    style={{ fontSize: "2rem" }}
                />
                {select && (
                    <span>
                        Are you sure you want to delete
                    </span>
                )}
            </div>
            {isLoading && (
                <ProgressBar
                    mode="indeterminate"
                    color='success'
                    className="mt-5"
                    style={{ height: "6px", width: "200px", margin: "0px auto" }}
                />
            )}
        </>
    );
};

export default DeleteConfirmContent;
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import React, { useEffect, useState } from 'react';

interface IProps {
    isLoading: boolean,
    value?: any,
}

const SubmitLoading = ({ isLoading, value }: IProps) => {

    return (
        <div style={{ marginTop: "30px" }}>
            <Button
                disabled={value?.filter((vl: any) => vl == '')?.length !== 0}
                type="submit"
                severity="success"
                label={isLoading ? "LOADING..." : "SUBMIT"}
                size='small'
                className="mt-10 p-2"
            />
        </div>
    );
};

export default SubmitLoading;
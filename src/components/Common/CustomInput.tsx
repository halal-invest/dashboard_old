import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import React from 'react';

interface IProps {
    label: string,
    value: string,
    setValue: any,
    submitted: boolean,
    focus?: boolean
}

const CustomInput = ({ label, value, setValue, submitted, focus }: IProps) => {
    return (
        <>
            <label htmlFor="title"> {label} </label>
            <InputText
                id="title"
                value={value}
                autoFocus={focus}
                onChange={(e) => setValue(e.target.value)}
                required
                className={classNames({
                    "p-invalid": submitted && !value,
                })}
            />
            {!submitted && !value && (
                <small
                    style={{ fontSize: "1rem", color: "red" }}
                    className="p-invalid"
                >
                    {label} is required.
                </small>
            )}
        </>
    );
};

export default CustomInput;
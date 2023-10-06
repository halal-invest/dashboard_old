import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import React from 'react';

interface IProps {
    label: string,
    value: number,
    setValue: any,
    submitted: boolean,
    focus?: boolean;
    required?: boolean;
}

const CustomInputNumber = ({ label, value, setValue, submitted, focus, required }: IProps) => {
    return (
        <>
            <label htmlFor="title"> {label} </label>
            <InputNumber
                inputId="title"
                value={value}
                autoFocus={focus}
                onValueChange={(e: any) => setValue(e.value)}
                required={required}
                className={classNames({
                    "p-invalid": submitted && !value,
                })}
            />
            {!submitted && !value && (
                <small
                    style={{ fontSize: "1rem", color: "red" }}
                    className="p-invalid"
                >
                    {required && `${label} is required.`}
                </small>
            )}
        </>
    );
};

export default CustomInputNumber;
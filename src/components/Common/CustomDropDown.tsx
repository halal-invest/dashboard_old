import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import React from 'react';
import ResetFormButton from '../Shared/ResetFormButton';

interface IProps {
    label: string,
    value: any,
    setValue: any,
    submitted: boolean,
    focus?: boolean;
    placeholder: string;
    optionSelected: string;
    data: any;
    required?: boolean;
    reset?: boolean;
}

const CustomDropDown = ({ label, placeholder, value, required, setValue,
    submitted, focus, optionSelected, data, reset }: IProps) => {
    return (
        <>
            <div className='flex justify-content-between'>
                <label htmlFor={label}>
                    {label}
                </label>
                <span> {reset && <ResetFormButton setHandler={setValue} />} </span>
            </div>
            <Dropdown
                id={label}
                value={value}
                optionLabel={optionSelected}
                options={data}
                placeholder={placeholder}
                autoFocus={focus}
                onChange={(e) => setValue(e.value)}
                required={required}
                className={classNames({
                    "p-invalid": submitted && !value,
                })}
            />
            {!submitted && !value && (
                <small
                    style={{ fontSize: "1rem", color: "red" }}
                    className="p-invalid" >
                    {required && `${label} is required.`}
                </small>
            )}
        </>
    );
};

export default CustomDropDown;
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import React from 'react';

interface IProps {
    label: string,
    value: any,
    setValue: any,
    submitted: boolean,
    focus?: boolean;
    placeholder: string;
    optionSelected: string;
    data: any
}

const CustomDropDown = ({ label, value, setValue, submitted, focus, optionSelected, data }: IProps) => {
    return (
        <>
            <label htmlFor="title"> {label} </label>
            <Dropdown
                id="title"
                value={value}
                optionLabel={optionSelected}
                options={data?.data}
                placeholder="Select a Category"
                autoFocus={focus}
                onChange={(e) => setValue(e.value)}
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

export default CustomDropDown;
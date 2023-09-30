import { Editor } from 'primereact/editor';
import { classNames } from 'primereact/utils';
import React from 'react';

interface IProps {
    label: string,
    value: string,
    setValue: any,
    submitted: boolean,
    require?: boolean,
    height: string,
}

const CustomEditorInput = ({ label, value, setValue, submitted, require, height }: IProps) => {
    return (
        <>
            <label htmlFor={label}> {label} </label>
            <Editor
                id={label}
                value={value}
                onTextChange={(e: any) => setValue(e.htmlValue)}
                required={require}
                style={{ height: height }}
                className={classNames({
                    "p-invalid": submitted && !label,
                })}
            />
            {!submitted && !label && (
                <small
                    style={{ fontSize: "1rem", color: "red " }}
                    className="p-invalid"
                >
                    {label} is required.
                </small>
            )}
        </>
    );
};

export default CustomEditorInput;
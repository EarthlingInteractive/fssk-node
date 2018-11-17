import classNames from "classnames";
import * as React from "react";

interface IFormInputProps {
	name: string;
	label?: string;
	type?: string;
	value?: string;
	error?: string;
	onChange?: (name: string, value: string) => void;
	placeholder?: string;
	fieldsetClass?: string;
	labelClass?: string;
	inputClass?: string;
	errorClass?: string;
	readonly?: boolean;
	disabled?: boolean;
	autoFocus?: boolean;
	size?: number;
	maxLength?: number;
}

const getFormInputClasses = (fieldsetClass: string, error: string) => classNames(fieldsetClass, {
	error: !!error,
});

const formInput: React.StatelessComponent<IFormInputProps> = ({
	name,
	label,
	value,
	error,
	onChange,
	type,
	placeholder,
	fieldsetClass,
	labelClass,
	inputClass,
	errorClass,
	readonly,
	disabled,
	autoFocus,
	size,
	maxLength,
	}) => {

	// It would be nice to not use a type of any on the event but there doesn't appear to be an easy way to
	// use a different type here (see https://github.com/Microsoft/TypeScript/issues/299)
	const changeEvent = onChange ? (e: any) => onChange(e.target.name, e.target.value) : () => { return; };

	const fsClass = getFormInputClasses((fieldsetClass || ""), (error || ""));

	return (

		<fieldset className={fsClass}>
			{label && <div className={labelClass}>{label}</div>}
			<input
				name={name}
				value={value}
				placeholder={placeholder}
				type={type}
				className={inputClass}
				onChange={changeEvent}
				readOnly={readonly}
				disabled={disabled}
				size={size}
				autoFocus={autoFocus}
				maxLength={maxLength}
			/>

			{/*
			We need the non-breaking space in the error field to reserve the vertical space for the error message
			The content of the error div will not be shown unless the whole fieldset has the error class applied
			but if there is no content of this div, the other elements shift up to fill the space and things get
			jumpy when errors appear
			*/}
			{errorClass && <div className={errorClass}>{error ? error : "\u00A0"}</div>}
		</fieldset>
	);
};

formInput.defaultProps = {
	type: "text",
	error: "",
	placeholder: "",
	autoFocus: false,
};

export default formInput;

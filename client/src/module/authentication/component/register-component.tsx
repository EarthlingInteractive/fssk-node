import {observer} from "mobx-react";
import * as React from "react";
import {Link} from "react-router-dom";
import FormInput from "../../common/component/form-input-component";

interface IRegisterComponentProps {
	submit: () => void;
	updateField: (field: string, val: string) => void;
	email?: string;
	emailError?: string;
	name?: string;
	nameError?: string;
	password?: string;
	passwordError?: string;
	confirmPassword?: string;
	confirmPasswordError?: string;
}

@observer
export default class RegisterComponent extends React.Component<IRegisterComponentProps> {

	constructor(props: IRegisterComponentProps) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
	}

	public render() {
		const {
			updateField,
			email,
			emailError,
			name,
			nameError,
			password,
			passwordError,
			confirmPassword,
			confirmPasswordError,
		} = this.props;

		return (
			<div className="dsk-Admin-form login">
				<div className="dsk-AdminLogin__content">
					<div className="dsk-Admin-form__title">
						Application Registration
					</div>
					<form onSubmit={this.onSubmit}>


						<FormInput
							label="name"
							name="name"
							value={name}
							error={nameError}
							onChange={updateField}
							fieldsetClass="dsk-Admin-form__item"
							labelClass="dsk-Admin-form__label"
							inputClass="dsk-Admin-form__input"
							errorClass="dsk-Admin-form__error"
						/>

						<FormInput
							label="email"
							type="email"
							name="email"
							value={email}
							error={emailError}
							onChange={updateField}
							fieldsetClass="dsk-Admin-form__item"
							labelClass="dsk-Admin-form__label"
							inputClass="dsk-Admin-form__input"
							errorClass="dsk-Admin-form__error"
						/>

						<FormInput
							label="password"
							type="password"
							name="password"
							value={password}
							error={passwordError}
							onChange={updateField}
							fieldsetClass="dsk-Admin-form__item"
							labelClass="dsk-Admin-form__label"
							inputClass="dsk-Admin-form__input"
							errorClass="dsk-Admin-form__error"
						/>

						<FormInput
							label="confirm password"
							type="password"
							name="confirmPassword"
							value={confirmPassword}
							error={confirmPasswordError}
							onChange={updateField}
							fieldsetClass="dsk-Admin-form__item"
							labelClass="dsk-Admin-form__label"
							inputClass="dsk-Admin-form__input"
							errorClass="dsk-Admin-form__error"
						/>
						<input type="submit" value="Register Account" className="dsk-Admin-form__submit" />
					</form>

					<p className="dsk-Admin-form__text a-text-align-center">
						Already have an account?&nbsp;
						<Link to="/login" className="dsk-Admin-form__textlink">
							Log in here.
						</Link>
					</p>
				</div>
			</div>
		);
	}

	private onSubmit(e: any) {
		e.preventDefault();
		this.props.submit();
	}
}

import {observer} from "mobx-react";
import * as React from "react";
import RegisterComponent from "../component/register-component";
import AuthStore from "../store/auth-store";

@observer
export default class RegisterContainer extends React.Component<any> {
	public render() {
		const {
			register,
			updateField,
			email,
			name,
			password,
			confirmPassword,
			emailError,
			nameError,
			passwordError,
			confirmPasswordError,
		} = AuthStore;

		const submit = () => {
			register().then((success) => {
				if (!success) { return; }

				// @todo decide what this register success action should really be
				this.props.history.push("/");
			});
		};

		const props = {
			submit,
			updateField,
			email,
			name,
			password,
			confirmPassword,
			emailError,
			nameError,
			passwordError,
			confirmPasswordError,
		};
		return (<RegisterComponent {...props} />);
	}
}

import {observer} from "mobx-react";
import * as React from "react";
import { withRouter } from "react-router-dom";
import RegisterComponent from "../component/register-component";
import AuthStore from "../store/auth-store";
import autobind from "autobind-decorator";

@observer
class RegisterContainer extends React.Component<any> {

	@autobind
	public async submit() {
		const { email, password, register, login, updateField } = AuthStore;
		const rememberUserCredentials = {
			email, password,
		};

		return register().then((success: boolean) => {
			if (!success) { return; }

			// Because the store fields get cleared after a succesful registration
			// We update the store fields to what the user had when they registered
			updateField("email", rememberUserCredentials.email);
			updateField("password", rememberUserCredentials.password);

			login().then((loginSuccess: boolean) => {
				// Try logging them in, and go to the root site on success or fail
				this.props.history.push("/");
			});
		});
	}


	public render() {
		const {
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

		const props = {
			submit: this.submit,
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

export default withRouter(RegisterContainer);

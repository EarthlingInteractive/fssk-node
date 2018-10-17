import {observer} from "mobx-react";
import * as React from "react";
import { withRouter } from "react-router-dom";
import RegisterComponent from "../component/register-component";
import AuthStore from "../store/auth-store";

@observer
class RegisterContainer extends React.Component<any> {
	public render() {
		const {
			register,
			login,
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
			const rememberUserCredentials = {
				email, password,
			};

			register().then((success: boolean) => {
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

export default withRouter(RegisterContainer);

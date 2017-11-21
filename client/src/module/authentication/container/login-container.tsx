import {observer} from "mobx-react";
import * as React from "react";
import LoginComponent from "../component/login-component";
import AuthStore from "../store/auth-store";

@observer
export default class LoginContainer extends React.Component<any> {
	public render() {
		const {
			login,
			updateField,
			email,
			password,
			emailError,
			passwordError,
		} = AuthStore;

		const submit = () => {
			login().then((success) => {
				if (!success) { return; }
				// @todo decide what this login success action should really be
				this.props.history.push("/");
			});
		};

		const props = {
			submit,
			updateField,
			email,
			password,
			emailError,
			passwordError,
		};
		return (<LoginComponent {...props} />);
	}
}

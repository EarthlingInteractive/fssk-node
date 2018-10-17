import {action, observable, configure} from "mobx";
import {checkRequiredFields} from "../../../util/validation";
import * as validator from "validator";
import fetchUtil from "../../../util/fetch-util";

configure({
	enforceActions: true, // don't allow editing of state outside of mobx actions
});

export class AuthStore {
	@observable public email: string = "";
	@observable public name: string = "";
	@observable public password: string = "";
	@observable public confirmPassword: string = "";

	@observable public emailError: string = "";
	@observable public nameError: string = "";
	@observable public passwordError: string = "";
	@observable public confirmPasswordError: string = "";

	@observable public user: any = null;
	@observable public hasLoadedSession: boolean = false;

	// make the object indexable so [] notation works
	[key: string]: any;

	private errorFields = ["emailError", "nameError", "passwordError", "confirmPasswordError"];
	private dataFields = ["email", "name", "password", "confirmPassword"];

	@action.bound public updateField(field: string, val: string) {
		switch (field) {
			case "email":
				this.email = val;
				break;

			case "name":
				this.name = val;
				break;

			case "password":
				this.password = val;
				break;

			case "confirmPassword":
				this.confirmPassword = val;
				break;

			default:
				this.handleError(new Error(`Something tried to update a field named ${field} in the authorization store`));
				return;
		}
	}

	@action.bound public async register() {
		if (!this.isRegistrationValid()) { return false; }

		const {email, name, password} = this;

		try {
			await fetchUtil("/api/users/register", {
				body: {
					email,
					name,
					password,
				},
				method: "POST",
			});

			// clear the fields for the next time the user comes to this page
			this.clearAll();
			return true;

		} catch (error) {
			this.handleError(error);
			return false;
		}
	}

	public validateRegistration(name: string, email: string, password: string, confirmPassword: string) {
		const results: any = {
			nameError: "",
			emailError: "",
			passwordError: "",
			confirmPasswordError: "",
			allValid: true,
		};

		const missingRequired = checkRequiredFields(
			["email", "name", "password", "confirmPassword"],
			{ email, name, password, confirmPassword },
		);

		if (missingRequired.length > 0) {
			missingRequired.forEach((key: string) => {
				results[`${key}Error`] = "Required Field";
			});
			results.allValid = false;
		}

		if (!results.emailError && !validator.isEmail(email)) {
			results.emailError = "Invalid Email Format";
			results.allValid = false;
		}

		if (!results.passwordError && !validator.isLength(password, {min: 10, max: 100})) {
			results.passwordError = "Password must be at least 10 characters";
			results.allValid = false;
		}

		if (!results.confirmPasswordError && (password !== confirmPassword)) {
			results.confirmPasswordError = "Passwords do not match";
			results.allValid = false;
		}

		return results;
	}

	@action.bound public async login() {
		if (!this.isLoginValid()) { return false; }

		const {email, password} = this;

		try {
			const response = await fetchUtil("/api/auth", {
				body: {
					email,
					password,
				},
				method: "POST",
			});

			// clear the fields for the next time the user comes to this page
			this.clearAll();

			// save the user info
			this.updateUser(response.user);

			return true;

		} catch (error) {
			this.handleError(error);
			return false;
		}
	}

	public validateLogin(email: string, password: string) {
		const results: any = {
			emailError: "",
			passwordError: "",
			allValid: true,
		};

		const missingRequired = checkRequiredFields(
			["email", "password"],
			{ email, password },
		);

		if (missingRequired.length > 0) {
			missingRequired.forEach((key: string) => {
				results[`${key}Error`] = "Required Field";
			});
			results.allValid = false;
		}

		if (!results.emailError && !validator.isEmail(email)) {
			results.emailError = "Invalid Email Format";
			results.allValid = false;
		}

		return results;
	}

	@action.bound public parseServerErrorResponse(error: any) {
		// for now the only error we really expect and can handle gracefully is a non-unique email
		if (error.status === 401) {
			// setting emailError to a non-empty string so both fields get shown in an error state
			// but we only want the error message at the bottom (under password)
			this.emailError = " ";
			this.passwordError = "Incorrect email or password";
		} else if (error.status === 500) {
			if (error.json && error.json.message === "email is not unique") {
				this.emailError = "A user already exists with this email";
			}
		}
	}

	public async loadSession() {
		try {
			const response = await fetchUtil("/api/auth");

			// save the user info
			this.updateUser(response.user);

		} catch (error) {
			this.handleError(error);
		}
	}

	@action.bound public async logout() {
		try {
			await fetchUtil("/api/auth", {
				method: "DELETE",
			});

			this.updateUser(null, true);

		} catch (error) {
			this.handleError(error);
		}
	}

	@action.bound public updateUser(user: any, isClearing = false) {
		this.user = user;
		this.hasLoadedSession = !isClearing;
	}

	public isLoggedIn() {
		return (this.user && this.user.id);
	}

	private isRegistrationValid() {
		const validation: any = this.validateRegistration(this.name, this.email, this.password, this.confirmPassword);

		this.emailError = validation.emailError;
		this.nameError = validation.nameError;
		this.passwordError = validation.passwordError;
		this.confirmPasswordError = validation.confirmPasswordError;

		return validation.allValid;
	}

	private isLoginValid() {
		const validation: any = this.validateLogin(this.email, this.password);

		this.emailError = validation.emailError;
		this.passwordError = validation.passwordError;

		return validation.allValid;
	}

	private clearAll() {
		const keys = this.errorFields.concat(this.dataFields);
		this.clearProperties(keys);
	}

	@action.bound private clearProperties(props: string[]) {
		props.forEach((key) => { this[key] = ""; });
	}

	private handleError(error: any) {
		// @todo report this error, somehow...?
		// console.error(error);
		this.parseServerErrorResponse(error);
	}
}

const authStore = new AuthStore();
export default authStore;

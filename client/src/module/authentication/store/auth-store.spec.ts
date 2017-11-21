const fetchMock = require("fetch-mock"); // tslint:disable-line
import * as fetchUtils from "../../../util/fetch-util";
import { AuthStore } from "./auth-store";

const validData = {
	email: "test@test.com",
	name: "tester",
	password: "passPASSpass",
	confirmPassword: "passPASSpass",
};

function setValidRegData(authStore: AuthStore) {
	authStore.updateField("email", validData.email);
	authStore.updateField("name", validData.name);
	authStore.updateField("password", validData.password);
	authStore.updateField("confirmPassword", validData.confirmPassword);
}

function setValidLoginData(authStore: AuthStore) {
	authStore.updateField("email", validData.email);
	authStore.updateField("name", validData.name);
	authStore.updateField("password", validData.password);
	authStore.updateField("confirmPassword", validData.confirmPassword);
}

describe("AuthStore", () => {

	describe("update field", () => {
		it("should correctly update all user changeable fields", () => {
			const authStore = new AuthStore();

			setValidRegData(authStore);

			expect(authStore.email).toEqual(validData.email);
			expect(authStore.name).toEqual(validData.name);
			expect(authStore.password).toEqual(validData.password);
			expect(authStore.confirmPassword).toEqual(validData.confirmPassword);
		});

		it("should not allow changing error fields directly", () => {
			const authStore = new AuthStore();

			authStore.updateField("emailError", "nope nope");
			expect(authStore.emailError).toEqual("");

		});

	});

	describe("registration validation", () => {
		const authStore = new AuthStore();

		it("should require name", () => {
			const validation = authStore.validateRegistration(
				"",
				validData.email,
				validData.password,
				validData.confirmPassword,
			);

			expect(validation.nameError.length).toBeGreaterThan(0);
			expect(validation.allValid).toBeFalsy();
		});

		it("should require email", () => {
			const validation = authStore.validateRegistration(
				validData.name,
				"",
				validData.password,
				validData.confirmPassword,
			);

			expect(validation.emailError.length).toBeGreaterThan(0);
			expect(validation.allValid).toBeFalsy();
		});

		it("should require password", () => {
			const validation = authStore.validateRegistration(
				validData.name,
				validData.email,
				"",
				validData.confirmPassword,
			);

			expect(validation.passwordError.length).toBeGreaterThan(0);
			expect(validation.allValid).toBeFalsy();
		});

		it("should require confirmPassword", () => {
			const validation = authStore.validateRegistration(
				validData.name,
				validData.email,
				validData.password,
				"",
			);

			expect(validation.confirmPasswordError.length).toBeGreaterThan(0);
			expect(validation.allValid).toBeFalsy();
		});

		it("should let valid data pass", () => {
			const validation = authStore.validateRegistration(
				validData.name,
				validData.email,
				validData.password,
				validData.confirmPassword,
			);

			expect(validation.allValid).toBeTruthy();
		});
	});

	describe("register", () => {
		const authStore = new AuthStore();

		beforeEach(() => { setValidRegData(authStore); });
		afterEach(fetchMock.restore);

		it("should register a new account", () => {
			fetchMock.post("*", {
				status: 200,
				statusCode: 200,
				headers: new Headers({"Content-Type":  "application/json"}),
				body: {id: 1234},
			});

			const getDataFromServer = spyOn(fetchUtils, "default").and.returnValue(Promise.resolve({ status: 200 }));

			return authStore.register().then(() => {
				expect(getDataFromServer).toHaveBeenCalled();
			});
		});

		it("should report service errors", () => {
			fetchMock.post("*", {
				status: 418,
				statusCode: 418,
				headers: new Headers({"Content-Type":  "application/json"}),
				body: {code: 418, message: "I'm a little teapot"},
			});

			const parseErrorSpy = spyOn(authStore, "parseServerErrorResponse");
			return authStore.register().then(() => {
				expect(parseErrorSpy).toHaveBeenCalled();
			});
		});

		it("should handle non-unique email errors", () => {
			fetchMock.post("*", {
				status: 400,
				statusCode: 400,
				headers: new Headers({"Content-Type":  "application/json"}),
				body: {fields: "email", validationType: "Value must be unique"},
			});

			return authStore.register().then(() => {
				expect(authStore.emailError.length).toBeGreaterThan(0);
			});
		});
	});

	describe("login validation", () => {
		const authStore = new AuthStore();

		it("should require email", () => {
			const validation = authStore.validateLogin(
				"",
				validData.password,
			);

			expect(validation.emailError.length).toBeGreaterThan(0);
			expect(validation.allValid).toBeFalsy();
		});

		it("should require password", () => {
			const validation = authStore.validateLogin(
				validData.email,
				"",
			);

			expect(validation.passwordError.length).toBeGreaterThan(0);
			expect(validation.allValid).toBeFalsy();
		});


		it("should let valid data pass", () => {
			const validation = authStore.validateLogin(
				validData.email,
				validData.password,
			);

			expect(validation.allValid).toBeTruthy();
		});
	});

	describe("login", () => {
		const authStore = new AuthStore();

		beforeEach(() => { setValidLoginData(authStore); });
		afterEach(fetchMock.restore);

		it("should perform a login", () => {
			fetchMock.post("*", {
				status: 200,
				statusCode: 200,
				headers: new Headers({"Content-Type":  "application/json"}),
				body: {id: 1234},
			});

			const getDataFromServer = spyOn(fetchUtils, "default").and.returnValue(Promise.resolve({ status: 200 }));

			return authStore.login().then(() => {
				expect(getDataFromServer).toHaveBeenCalled();
			});
		});

		it("should report service errors", () => {
			fetchMock.post("*", {
				status: 418,
				statusCode: 418,
				headers: new Headers({"Content-Type":  "application/json"}),
				body: {code: 418, message: "I'm a little teapot"},
			});

			const parseErrorSpy = spyOn(authStore, "parseServerErrorResponse");
			return authStore.login().then(() => {
				expect(parseErrorSpy).toHaveBeenCalled();
			});
		});
	});

	describe("logout", () => {
		const authStore = new AuthStore();

		beforeEach(() => { setValidLoginData(authStore); });
		afterEach(fetchMock.restore);

		it("should perform a log out", () => {
			fetchMock.delete("*", {
				status: 200,
				statusCode: 200,
			});

			const getDataFromServer = spyOn(fetchUtils, "default").and.returnValue(Promise.resolve({ status: 200 }));

			return authStore.logout().then(() => {
				expect(getDataFromServer).toHaveBeenCalled();
			});
		});
	});

	describe("update user", () => {
		const authStore = new AuthStore();

		it("should set the user object and hasLoadedSession", () => {
			const user = {
				id: 12345,
				isAdmin: false,
			};

			authStore.updateUser(user);

			expect(authStore.user.id).toEqual(user.id);
			expect(authStore.user.isAdmin).toBeFalsy();
			expect(authStore.hasLoadedSession).toBeTruthy();
		});

		it("should clear hasLoadedSession if applicable", () => {
			authStore.updateUser({}, true);

			expect(authStore.hasLoadedSession).toBeFalsy();
		});
	});
});

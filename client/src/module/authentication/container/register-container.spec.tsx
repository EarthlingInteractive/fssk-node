import * as React from "react";
import * as Enzyme from "enzyme";
import { BrowserRouter as Router } from "react-router-dom";
import RegisterContainer from "../container/register-container";
import * as fetchUtils from "../../../util/fetch-util";
import fetchMock from "fetch-mock";
import waitForExpect from "wait-for-expect";

const validData = {
	email: "test@test.com",
	name: "tester",
	password: "passPASSpass",
	confirmPassword: "passPASSpass",
};

function fillOutForm(wrapper) {
	const nameField = wrapper.find('input[name="name"]');
	const emailField = wrapper.find('input[name="email"]');
	const passwordField = wrapper.find('input[name="password"]');
	const passwordConfirmField = wrapper.find('input[name="confirmPassword"]');

	expect(nameField).toHaveLength(1);
	expect(emailField).toHaveLength(1);
	expect(passwordField).toHaveLength(1);
	expect(passwordConfirmField).toHaveLength(1);

	nameField.instance().value = validData.name;
	nameField.simulate("change").simulate("blur");

	emailField.instance().value = validData.email;
	emailField.simulate("change").simulate("blur");

	passwordField.instance().value = validData.password;
	passwordField.simulate("change").simulate("blur");

	passwordConfirmField.instance().value = validData.confirmPassword;
	passwordConfirmField.simulate("change").simulate("blur");
}

function checkDidSubmitForm(wrapper) {
	// Get instance of register container
	const registerContainerInstance = wrapper.find("RegisterContainer").instance();

	// Setup spy on the submit method in instance, and update container
	const spy = spyOn(registerContainerInstance, "submit");
	wrapper.update();

	// Need the container instance to update itself as well
	// (sometimes wrapper.update doesn't actually update the component)
	registerContainerInstance.forceUpdate();

	// Find the form in our container
	const form = wrapper.find("form");
	expect(form).toHaveLength(1);
	form.simulate("submit");

	// Wait for our submit to have been called
	return waitForExpect(() => {
		return expect(spy).toHaveBeenCalled();
	});
}

function submitForm(wrapper) {
	const wrapperContainer = wrapper.find("RegisterContainer");
	return wrapperContainer.instance().submit();
}

describe("RegisterContainer", () => {
	it("renders without crashing", () => {
		Enzyme.mount(<Router><RegisterContainer /></Router>);
	});

	it("renders a RegisterContainer", () => {
		const wrapper = Enzyme.mount(<Router><RegisterContainer /></Router>);
		expect(wrapper.find(RegisterContainer)).toHaveLength(1);
	});

	describe("when filling out form", () => {
		let wrapper;

		beforeEach(() => {
			wrapper = Enzyme.mount(<Router><RegisterContainer/></Router>);
		});

		afterEach(() => {
			fetchMock.restore();
			jest.restoreAllMocks();
		});

		it ("can fill out entire form and submit", async () => {
			fillOutForm(wrapper);
			await checkDidSubmitForm(wrapper);
		});

		it ("submits registration to api", async () => {
			// Fillout form and spy on api calls
			fillOutForm(wrapper);
			const fetchSpy = spyOn(fetchUtils, "default");

			// Submit the form
			await submitForm(wrapper);

			// Expect the registration api call with the content we entered
			expect(fetchSpy).toHaveBeenCalledWith("/api/users/register", {
				body: {
					email: validData.email,
					name: validData.name,
					password: validData.password,
				},
				method: "POST",
			});
		});

		it ("attempts a login after valid registration", async () => {
			fillOutForm(wrapper);

			// Mock the registration response
			fetchMock.mock("/api/users/register", {
				status: 200,
				statusCode: 200,
				headers: new Headers({"Content-Type":  "application/json"}),
				body: {id: 1234},
			}, { method: "post"});

			const fetchSpy = spyOn(fetchUtils, "default").and.returnValue(Promise.resolve({ status: 200 }));

			// Submit the form
			await submitForm(wrapper);

			// Should be called two times, once for registration and again for logging in
			expect(fetchSpy).toHaveBeenCalledTimes(2);

			// Expect the login api call with the registration content we entered
			expect(fetchSpy).toHaveBeenCalledWith("/api/auth", {
				body: {
					email: validData.email,
					password: validData.password,
				},
				method: "POST",
			});
		});
	});
});

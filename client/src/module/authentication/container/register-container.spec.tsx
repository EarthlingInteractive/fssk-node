import * as React from "react";
import * as Enzyme from "enzyme";
import { BrowserRouter as Router } from "react-router-dom";
import RegisterContainer from "../container/register-container";
import * as fetchUtils from "../../../util/fetch-util";
const fetchMock = require("fetch-mock");

const validData = {
	email: "test@test.com",
	name: "tester",
	password: "passPASSpass",
	confirmPassword: "passPASSpass",
};

function fillOutForm(wrapper) {
	let nameField = wrapper.find('input[name="name"]');
	let emailField = wrapper.find('input[name="email"]');
	let passwordField = wrapper.find('input[name="password"]');
	let passwordConfirmField = wrapper.find('input[name="confirmPassword"]');

	expect(nameField).toHaveLength(1);
	expect(emailField).toHaveLength(1);
	expect(passwordField).toHaveLength(1);
	expect(passwordConfirmField).toHaveLength(1);

	nameField.instance().value = validData.name;
	nameField.simulate('change').simulate('blur');

	emailField.instance().value = validData.email;
	emailField.simulate('change').simulate('blur');

	passwordField.instance().value = validData.password;
	passwordField.simulate('change').simulate('blur');

	passwordConfirmField.instance().value = validData.confirmPassword;
	passwordConfirmField.simulate('change').simulate('blur');
}

function submitForm(wrapper) {
	// Finds the form on the container and simulate hitting the 'register' button
	const form = wrapper.find('form');
	expect(form).toHaveLength(1);
	form.simulate('submit');
	// Wait a few seconds to the events to propagate - there are no promises we can wait for
	// at the wrapper level to see if this is done so this is the next best thing for now
	return new Promise(resolve => setTimeout(resolve, 4000));
}

describe("RegisterContainer", () => {
	it("renders without crashing", () => {
		Enzyme.mount(<Router><RegisterContainer></RegisterContainer></Router>);
	});

	it("renders a RegisterContainer", () => {
		const wrapper = Enzyme.mount(<Router><RegisterContainer></RegisterContainer></Router>);
		expect(wrapper.find(RegisterContainer)).toHaveLength(1);
	});

	describe("when filling out form", () => {
		let wrapper;

		beforeEach(() => {
			wrapper = Enzyme.mount(<Router><RegisterContainer></RegisterContainer></Router>);
		});

		afterEach(fetchMock.restore);

		it ('can fill out entire form', () => {
			fillOutForm(wrapper);
		});

		it ('can submit registration', async () => {
			fillOutForm(wrapper);
			const fetchSpy = spyOn(fetchUtils, "default");

			await submitForm(wrapper);

			// Expect the registration api call with the content we entered
			expect(fetchSpy).toHaveBeenCalledWith('/api/users/register', {
				body: {
					email: validData.email,
					name: validData.name,
					password: validData.password,
				},
				method: "POST",
			});
		});

		it ('attempts a login after registration', async () => {
			fillOutForm(wrapper);

			// Mock the registration response
			fetchMock.post("/api/users/register", {
				status: 200,
				statusCode: 200,
				headers: new Headers({"Content-Type":  "application/json"}),
				body: {id: 1234},
			});

			const fetchSpy = spyOn(fetchUtils, "default").and.returnValue(Promise.resolve({ status: 200 }))

			// Submit the form
			await submitForm(wrapper);

			// Should be called two times, once for registration and again for logging in
			expect(fetchSpy).toHaveBeenCalledTimes(2);

			// Expect the login api call with the registration content we entered
			expect(fetchSpy).toHaveBeenCalledWith('/api/auth', {
				body: {
					email: validData.email,
					password: validData.password,
				},
				method: "POST",
			});
		});
	});
});

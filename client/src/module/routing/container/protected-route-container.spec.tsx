import * as React from 'react';
import {shallow} from 'enzyme';
import ProtectedRouteContainer from './protected-route-container';
import AuthStore from "../../authentication/store/auth-store";
import {runInAction} from "mobx";
import { Redirect, Route} from "react-router-dom";

describe('ProtectedRouteContainer', () => {
	describe('when session is loading', () => {
		it('shows a loading message', () => {
			runInAction(() => {
				AuthStore.hasLoadedSession = false;
			});
			const wrapper = shallow(<ProtectedRouteContainer />);
			expect(wrapper).toContainReact(<div>loading...</div>);
		});
	});
	describe('when session has completed loading', () => {
		beforeEach(() => {
			runInAction(() => {
				AuthStore.hasLoadedSession = true;
			});
		});

		describe('and user is logged in', () => {
			it('renders a Route', () => {
				runInAction(() => {
					AuthStore.user = {
						id: 1
					};
				});
				const wrapper = shallow(<ProtectedRouteContainer />);
				expect(wrapper.find(Route)).toBePresent();
			});
		});
		describe('and user is not logged in', () => {
			it('redirects to the login page', () => {
				runInAction(() => {
					AuthStore.user = null;
				});
				const wrapper = shallow(<ProtectedRouteContainer />);
				expect(wrapper.find(Redirect)).toBePresent();
				expect(wrapper.find(Redirect)).toHaveProp('to', '/login');
			});
		});
	});
});

import * as React from "react";
import {shallow} from "enzyme";
import RoutingContainer from "./routing-container";
import { BrowserRouter as Router } from "react-router-dom";

describe("RoutingContainer", () => {
	it("renders without crashing", () => {
		shallow(<RoutingContainer/>);
	});

	it("renders a Router", () => {
		const wrapper = shallow(<RoutingContainer/>);
		expect(wrapper.find(Router)).toHaveLength(1);
	});
});

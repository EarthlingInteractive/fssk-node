import * as React from "react";
// these react-router-dom vars are implicitly "any"
// because the type definition file isn't compatible with our version of typescript
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import LoginContainer from "../../authentication/container/login-container";
import RegisterContainer from "../../authentication/container/register-container";
import TodoContainer from "../../todo/container/todo-container";
import ProtectedRoute from "./protected-route-container";

export default class RoutingContainer extends React.Component<any> {
	public render() {
		const pageNotFound = () => (<h1>404 - Page not found</h1>);
		return (
				<Router>
					<Switch>
						<Route exact path="/login" component={LoginContainer} />
						<Route exact path="/register" component={RegisterContainer} />
						<ProtectedRoute exact path="/" component={TodoContainer} />
						<Route component={pageNotFound} />
					</Switch>
				</Router>
		);
	}
}

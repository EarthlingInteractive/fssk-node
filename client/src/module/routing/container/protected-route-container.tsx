import {observer} from "mobx-react";
import * as React from "react";
import {Redirect, withRouter} from "react-router-dom";
import AuthStore from "../../authentication/store/auth-store";

@observer
class ProtectedRouteContainer extends React.Component<any> {
	public componentDidMount() {
		AuthStore.loadSession();
	}

	public render() {
		if (!AuthStore.hasLoadedSession) {
			return (<div>loading...</div>);
		}

		if (AuthStore.isLoggedIn()) {
			return (<this.props.component {...this.props}/>);
		} else {
			return (<Redirect to="/login" />);
		}
	}
}

// wrapping the component in withRouter makes sure that all the properties which are injected in route components
// also go to the child of this component
export default withRouter(ProtectedRouteContainer);



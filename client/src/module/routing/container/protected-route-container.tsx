import {observer} from "mobx-react";
import * as React from "react";
import {Redirect, Route} from "react-router-dom";
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
			return (<Route {...this.props}/>);
		} else {
			return (<Redirect to="/login" />);
		}
	}
}

export default ProtectedRouteContainer;



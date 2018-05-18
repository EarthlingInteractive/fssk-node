import * as React from "react";
import AuthStore from "../../authentication/store/auth-store";

export default class NavComponent extends React.Component<any> {

	constructor(props: any) {
		super(props);
		this.logout = this.logout.bind(this);
	}

	public render() {
		return (
			<nav className="navbar navbar-toggleable-md navbar-inverse fixed-top bg-inverse">
				<button
					className="navbar-toggler navbar-toggler-right hidden-lg-up"
					type="button"
					data-toggle="collapse"
					data-target="#navbarsExampleDefault"
					aria-controls="navbarsExampleDefault"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon" />
				</button>
				<a className="navbar-brand" href="#">Full Stack Starter Kit!</a>

				<div className="navbar-collapse" id="navbarsExampleDefault">
					<ul className="navbar-nav mr-auto">
						<li className="nav-item active">
							<a className="nav-link" href="#">To-do List<span className="sr-only">(current)</span></a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="#">Settings</a>
						</li>
					</ul>
					<form className="form-inline mt-2 mt-md-0">
						<button className="btn btn-outline-secondary my-2 my-sm-0" onClick={this.logout}>Logout</button>
					</form>
				</div>
			</nav>
		);
	}

	private logout(e: any): void {
		e.preventDefault();
		AuthStore.logout()
			.then(() => {
			this.props.history.push("/login");
		});
	}

}

let newrelic: any = {};

if (Object.prototype.hasOwnProperty.call(process.env, "NEWRELIC_LICENSE")) {
	console.log("Enabling New Relic"); // tslint:disable-line
	newrelic = require("newrelic"); // tslint:disable-line
}

export default newrelic;

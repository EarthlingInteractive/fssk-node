import * as querystring from "querystring";

export interface IFetchUtilError {
	status: number;
	statusCode: number;
	statusText?: string;
	json?: JSON;
}

export default function fetchUtil(url: string, options?: any) {
	const request = requestHandler(url, options);
	return fetch(request.url, request.options)
		.then(handleResponse);
}

export function requestHandler(url: string, options?: any) {

	const def = {
		method: "GET",
		headers: {"Content-Type": "application/json"},
		credentials: "include",
	};

	if (!options) {
		return { url, options: def };
	}

	const opt = Object.assign({}, def, options); // tslint:disable-line

	delete opt.body;
	if (options.body) {
		if (!objectIsEmpty(options.body)) {

			// For GET requests, add querystring of body to url
			if (opt.method === "GET") {
				url = url + "?" + querystring.stringify(options.body);

			// For all other request types, stringify body
			} else {
				opt.body = JSON.stringify(options.body);
			}
		}
	}
	return { url, options: opt };
}

export const handlers = {
	JSONResponseHandler(response: Response) {
		return response.json()
			.then((json: any) => {
				if (response.ok) {
					return json;
				}
				return Promise.reject(Object.assign({}, { // tslint:disable-line
					statusCode: response.status, // statusCode is deprecated.
					status: response.status,
					json,
				}));
			});
	},
	textResponseHandler(response: Response) {
		if (response.ok) {
			return response.text();
		}
		return Promise.reject(Object.assign({}, { // tslint:disable-line
			statusCode: response.status,
			status: response.status,
			statusText: response.statusText,
		}));
	},
};

export function handleResponse(response: Response) {
	const contentType: string = response.headers.get("content-type") || "";
	if (contentType.includes("application/json")) {
		return handlers.JSONResponseHandler(response);
	} else if (contentType.includes("text/html")) {
		return handlers.textResponseHandler(response);
	} else if (!contentType) {
		return response;
	} else {
		throw new Error(`Sorry, content-type ${contentType} not supported`);
	}
}

function objectIsEmpty(obj: object) {
	return (Object.getOwnPropertyNames(obj).length === 0);
}

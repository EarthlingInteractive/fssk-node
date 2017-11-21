const fetchMock = require("fetch-mock"); // tslint:disable-line
import {
	default as fetchUtil, handleResponse, handlers,
	requestHandler,
} from "./fetch-util";

describe("fetchUtil", () => {
	describe("requestHandler", () => {
		it("should return default if no options given", () => {
			const url = "/api/sessions";
			const def: RequestInit = {
				method: "GET",
				headers: {"Content-Type": "application/json"},
				credentials: "include",
			};
			const request = requestHandler(url);
			expect(request.url).toEqual(url);
			expect(request.options).toEqual(def);
		});

		it("should add given options to default", () => {
			const url = "/api/sessions";
			const def: RequestInit = {
				method: "GET",
				headers: {"Content-Type": "application/json"},
				cache: "default",
				credentials: "include",
			};

			const request = requestHandler(url, {cache: "default"});
			expect(request.url).toEqual(url);
			expect(request.options).toEqual(def);
		});

		it("should stringify body of POST requests", () => {
			const url = "/api/sessions";
			const data = {id: 5};
			const pre: RequestInit = {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: data,
				credentials: "include",
			};
			const post: RequestInit = {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(data),
				credentials: "include",
			};

			const request = requestHandler(url, pre);
			expect(request.url).toEqual(url);
			expect(request.options).toEqual(post);
		});

		it("should add querystring to GET request url", () => {
			const baseUrl = "/api/profile/load";
			const data = {userId: 5};
			const def: RequestInit = {
				method: "GET",
				headers: {"Content-Type": "application/json"},
				credentials: "include",
			};

			const request = requestHandler(baseUrl, {body: data});
			expect(request.url).toEqual(baseUrl + "?userId=5");
			expect(request.options).toEqual(def);
		});

	});

	describe("handleResponse", () => {
		const response = {
			headers: {
				get: () => {
					return "";
				},
			},
		};

		it("should throw error if content type is unknown", () => {
			const responseSpy = spyOn(response.headers, "get");
			responseSpy.and.returnValue("application/xml");

			expect(() => { handleResponse(response as any); }).toThrow();
		});

		it("should call JSONResponseHandler for json", () => {
			const responseSpy = spyOn(response.headers, "get");
			responseSpy.and.returnValue("application/json");

			const jSONResponseHandlerSpy = spyOn(handlers, "JSONResponseHandler");
			handleResponse(response as any);
			expect(jSONResponseHandlerSpy).toHaveBeenCalled();
		});

		it("should call textResponseHandler for html", () => {
			const responseSpy = spyOn(response.headers, "get");
			responseSpy.and.returnValue("text/html");

			const textResponseHandlerSpy = spyOn(handlers, "textResponseHandler");
			handleResponse(response as any);
			expect(textResponseHandlerSpy).toHaveBeenCalled();
		});
	});

	describe("JSONResponseHandler", () => {
		const response = {
				json: () => {
					return Promise.resolve({id: 5});
				},
				ok: true,
				status: 200,
		};

		it("should return rejected promise if response is not 200", () => {
			response.ok = false;
			response.status = 400;
			return expect(handlers.JSONResponseHandler(response as any)).rejects.toHaveProperty("status", 400);
		});

		it("should return json on success", () => {
			response.ok = true;
			response.status = 200;
			return handlers.JSONResponseHandler(response as any)
				.then((data) => {
					expect(data).toEqual({id: 5});
				});

		});

	});

	describe("textResponseHandler", () => {
		const response = {
			text: () => {
				return Promise.resolve("woo");
			},
			ok: true,
			status: 200,
			statusText: "ok",
		};

		it("should return rejected promise if response is not 200", () => {
			response.ok = false;
			response.status = 400;
			response.statusText = "not found";
			return expect(handlers.textResponseHandler(response as any)).rejects.toHaveProperty("status", 400);
		});

		it("should return text on success", () => {
			response.ok = true;
			response.status = 200;
			return handlers.textResponseHandler(response as any)
				.then((data) => {
					expect(data).toEqual("woo");
				});
		});
	});

	describe("fetchUtil", () => {
		it("should call fetch with given url and return expected data", () => {
			fetchMock.get("*", {
				headers: new Headers({"Content-Type":  "application/json"}),
				body: {id: 5},
			});
			return fetchUtil("api/fake/1")
				.then((data: any) => {
					expect(fetchMock.lastUrl()).toBe("api/fake/1");
					expect(data).toEqual({id: 5});
					fetchMock.restore();
				});
		});

		it("should return rejected promise on service error", () => {
			fetchMock.get("*", {
				status: 418,
				statusCode: 418,
				headers: new Headers({"Content-Type":  "application/json"}),
				body: {id: 5},
			});
			return expect(fetchUtil("api/fake/1")).rejects.toHaveProperty("status", 418);
		});

	});

});

import HTTPRequestBuilder from "../../src/request_builder/HTTPRequestBuilder";

test("Should make a request", () => {
	const requestBuilder : HTTPRequestBuilder = new HTTPRequestBuilder();
	
	expect(requestBuilder.makeRequest("http://localhost:1", {
		method: "GET"
	})).resolves.toThrow(Error).catch((error : Error) => {
		throw error;
	});
});
import HTTPRequestBuilder from "../../src/request_builder/HTTPRequestBuilder";

test("Should make a request", (done : any) => {
	const requestBuilder : HTTPRequestBuilder = new HTTPRequestBuilder();
	
	requestBuilder.makeRequest("http://localhost:1", {
		method: "GET"
	}).catch((error : any) => {
		expect(error).not.toBeNull();
		done();
	});
});
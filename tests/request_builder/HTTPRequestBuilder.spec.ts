import "mocha";
import { expect, use } from "chai";
import HTTPRequestBuilder from "../../src/request_builder/HTTPRequestBuilder";
import * as chaiPromises from "chai-as-promised";

use(chaiPromises);

describe("HTTPRequestBuilder", () => {
	describe("makeRequest", () => {
		it("Should make a request", () => {
			const requestBuilder : HTTPRequestBuilder = new HTTPRequestBuilder();
			
			return expect(requestBuilder.makeRequest("http://localhost:1", {
				method: "GET"
			}).catch((error: Error) => {
				throw error;
			})).to.eventually.be.rejectedWith(Error);
		});
	});
});
import HTTPRequestBuilder from "../request_builder/HTTPRequestBuilder";
import { Response } from "node-fetch";
import ITunnel from "./ITunnel";

export default class Ngrok {
    private static ngrokTunnelsURL : string = "http://localhost:4040/api/tunnels";
    private static requestBuilder : HTTPRequestBuilder = new HTTPRequestBuilder();

    public static async getURL() : Promise<string> {
        const response : Response = await this.requestBuilder.makeRequest(this.ngrokTunnelsURL, {});
        const payload : any = await response.json();
        const tunnels : ITunnel[] = payload.tunnels;
        const secureTunnel: ITunnel = this.getSecureNgrokTunnel(tunnels);
        return secureTunnel.public_url;
    }

    private static getSecureNgrokTunnel(tunnels: ITunnel[]) : ITunnel {
        return tunnels.filter((tunnel: ITunnel) => {
            return tunnel.proto === "https";
        })[0];
    }

    
}
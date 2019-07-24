import { ILogger } from "@collate/logging";

export default class FakeLogger implements ILogger {
    public debug() : void {
        return;
    }
    
    public error() : void {
        return;
    }
    
    public info() : void {
        return;
    }

    public warn() : void {
        return;
    }
}
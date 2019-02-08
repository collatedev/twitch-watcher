import App from "./App"
import HookRouter from "./routes/HookRouter";
import TwitchUserModel from "./models/TwitchUserModel";

let app : App = new App();
app.initialize();

app.addRouter(new HookRouter(new TwitchUserModel()));

let port : number = parseInt(process.argv[2], 10);
app.start(port);

export default app;
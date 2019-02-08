import App from "./App"
import HookRouter from "./routes/HookRouter";

let app : App = new App();
app.initialize();

app.addRouter(new HookRouter());

let port : number = parseInt(process.argv[2], 10);
app.start(port);

export default app;
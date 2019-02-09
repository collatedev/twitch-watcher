import App from "./App"
import UserRouter from "./routes/UserRouter";
import UserModel from "./models/UserModel";
import SubscriptionRouter from "./routes/SubscriptionRouter"
import UserLayer from "./Layers/UserLayer";

let app : App = new App();
app.initialize();

let userLayer = new UserLayer(new UserModel());
app.addRouter(new UserRouter(userLayer));
app.addRouter(new SubscriptionRouter(userLayer));

let port : number = parseInt(process.argv[2], 10);
app.start(port);

export default app;
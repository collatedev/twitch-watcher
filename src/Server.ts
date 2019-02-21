import App from "./App"
import UserRouter from "./routes/UserRouter";
import UserModel from "./models/UserModel";
import SubscriptionRouter from "./routes/SubscriptionRouter"
import UserLayer from "./Layers/UserLayer";
import StreamRouter from "./routes/StreamRouter";

function main() {
	const app : App = new App();
	app.initialize();

	const userLayer = new UserLayer(new UserModel());
	app.addRouter(new UserRouter(userLayer));
	app.addRouter(new SubscriptionRouter(userLayer));
	app.addRouter(new StreamRouter());

	const port : number = parseInt(process.argv[2], 10);
	app.start(port);
}

try {
	main();
} catch(error) {
	throw error;
}
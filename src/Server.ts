import App from "./App";
import UserRouter from "./routes/UserRouter";
import UserModel from "./models/UserModel";
import SubscriptionRouter from "./routes/SubscriptionRouter";
import UserLayer from "./Layers/UserLayer";
import StreamRouter from "./routes/StreamRouter";
import UserFollowedRouter from "./routes/UserFollowedRouter";
import NewFollowerRouter from "./routes/NewFollowerRouter";
import TwitchProfileUpdateRouter from "./routes/TwitchProfileUpdateRouter";

const PortIndex : number = 2;

function main() : void {
	const app : App = new App();
	app.initialize();

	const userLayer : UserLayer = new UserLayer(new UserModel());
	app.addRouter(new UserRouter(userLayer));
	app.addRouter(new SubscriptionRouter(userLayer));
	app.addRouter(new StreamRouter());
	app.addRouter(new UserFollowedRouter());
	app.addRouter(new NewFollowerRouter());
	app.addRouter(new TwitchProfileUpdateRouter());

	const port : number = parseInt(process.argv[PortIndex], 10);
	app.start(port);
}

try {
	main();
} catch(error) {
	throw error;
}
import App from "./App";
import UserRouter from "./routes/UserRouter";
import UserModel from "./models/UserModel";
import SubscriptionRouter from "./routes/SubscriptionRouter";
import UserLayer from "./Layers/UserLayer";
import StreamRouter from "./routes/StreamRouter";
import UserFollowedRouter from "./routes/UserFollowedRouter";
import NewFollowerRouter from "./routes/NewFollowerRouter";
import TwitchProfileUpdateRouter from "./routes/TwitchProfileUpdateRouter";
import { ILogger, Logger } from "@collate/logging";

const PortIndex : number = 2;

function main() : void {
	const logger : ILogger = getLogger();
	const app : App = new App(logger);
	app.initialize();

	const userLayer : UserLayer = new UserLayer(new UserModel());
	app.addRouter(new UserRouter(userLayer, logger));
	app.addRouter(new SubscriptionRouter(userLayer, logger));
	app.addRouter(new StreamRouter(logger));
	app.addRouter(new UserFollowedRouter(logger));
	app.addRouter(new NewFollowerRouter(logger));
	app.addRouter(new TwitchProfileUpdateRouter(logger));

	const port : number = parseInt(process.argv[PortIndex], 10);
	app.start(port);
}

function getLogger() : ILogger {
	if (process.env.LOG_LEVEL) {
		return new Logger(process.env.LOG_LEVEL, "app.log");
	} else {
		return new Logger("info", "app.log");
	}
}

try {
	main();
} catch(error) {
	throw error;
}
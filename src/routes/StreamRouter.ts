import TopicRouter from "./TopicRouter";

export default class StreamRouter extends TopicRouter {
    constructor() {
        super('/streams')
    }
}
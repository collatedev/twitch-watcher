export default class AuthorizedTopic {
    private static readonly EmptyScope : string = "";
    private static readonly AuthorizedTopics: { [id: string]: string[] } = {
		"user": ["user:read:email"]
	};

    public static isAuthorizedTopic(topic : string) : boolean {
        return this.AuthorizedTopics.hasOwnProperty(topic);
    }

    public static scope(topic: string) : string {
        if (!this.isAuthorizedTopic(topic)) {
            return this.EmptyScope;
        } else {
            return this.AuthorizedTopics[topic].join(" ").trim();
        }
    }
}
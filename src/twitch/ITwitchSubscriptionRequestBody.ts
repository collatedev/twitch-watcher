export default interface ITwitchSubscriptionRequestBody {
	"hub.mode": string
	"hub.topic": string
	"hub.callback": string
	"hub.lease_seconds": number
	"hub.secret": string
}
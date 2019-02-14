export default interface ChallengeBody {
    'hub.topic': string;
    'hub.lease_seconds': number;
    'hub.mode': string;
    'hub.challenge': string;
}
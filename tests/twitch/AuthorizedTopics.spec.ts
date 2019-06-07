import AuthorizedTopic from '../../src/twitch/AuthorizedTopic';
import { expect } from 'chai';

describe('AuthorizedTopics', () => {
    describe('isAuthorizedTopic', () => {
        it('is an authorized topic', () => {
            expect(AuthorizedTopic.isAuthorizedTopic("user")).to.equal(true);
        });

        it('is not an authorized topic', () => {
            expect(AuthorizedTopic.isAuthorizedTopic("foo")).to.equal(false);
        });
    });

    describe('scope', () => {
        it('unauthorized topic has no scope', () => {
            expect(AuthorizedTopic.scope("foo")).to.equal("");
        });

        it('authorized topic has a scope', () => {
            expect(AuthorizedTopic.scope("user")).to.equal("user:read:email");
        });
    });
});
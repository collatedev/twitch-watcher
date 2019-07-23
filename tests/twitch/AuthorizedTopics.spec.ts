import AuthorizedTopic from '../../src/twitch/AuthorizedTopic';

describe('isAuthorizedTopic', () => {
    test('is an authorized topic', () => {
        expect(AuthorizedTopic.isAuthorizedTopic("user")).toEqual(true);
    });

    test('is not an authorized topic', () => {
        expect(AuthorizedTopic.isAuthorizedTopic("foo")).toEqual(false);
    });
});

describe('scope', () => {
    test('unauthorized topic has no scope', () => {
        expect(AuthorizedTopic.scope("foo")).toEqual("");
    });

    test('authorized topic has a scope', () => {
        expect(AuthorizedTopic.scope("user")).toEqual("user:read:email");
    });
});

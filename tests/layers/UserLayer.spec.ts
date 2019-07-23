import UserLayer from '../../src/layers/UserLayer';
import FakeUserModel from '../../src/models/UserModel';
import TwitchUser from '../../src/schemas/user/TwitchUser';

describe('getUserInfo', () => {
    it('Should get a user with id 1', async () => {
        const layer : UserLayer = new UserLayer(new FakeUserModel());
        
        const user : TwitchUser = await layer.getUserInfo(1);

        expect(user.id).toEqual(1);
    });
});
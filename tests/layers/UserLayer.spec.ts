import UserLayer from '../../src/layers/UserLayer';
import TwitchUser from '../../src/schemas/user/TwitchUser';
import FakeUserModel from '../fakes/FakeUserModel';
import FakeTwitchService from '../fakes/FakeTwitchService';
import IUserLayer from '../../src/layers/IUserLayer';

describe('getUserInfo', () => {
    it('Should get a user with id 1', async () => {
        const userModel : FakeUserModel = new FakeUserModel();
        userModel.addUser(1);
        const layer : IUserLayer = new UserLayer(userModel, new FakeTwitchService());
        
        const user : TwitchUser = await layer.getUserInfo(1);

        expect(user.id).toEqual(1);
    });
});
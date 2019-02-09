import { expect } from 'chai';
import UserLayer from '../../src/layers/UserLayer'
import FakeUserModel from '../../src/models/UserModel'
import 'mocha';
import TwitchUser from '../../src/schemas/TwitchUser';

describe('User Layer', () => {
    describe('getUserInfo', () => {
        it('Should get a user with id 1', async () => {
            let controller = new UserLayer(new FakeUserModel());
            
            let user : TwitchUser = await controller.getUserInfo(1);

            expect(user.id).to.equal(1);
        })
    });
});
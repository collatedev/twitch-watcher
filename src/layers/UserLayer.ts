import UserModel from "../models/UserModel";

export default class UserLayer {
    private userModel: UserModel;

    constructor(userModel: UserModel) {
        this.userModel = userModel;
    }

    public async getUserInfo(id: number) {
        try {
            return await this.userModel.getByID(id);
        } catch (exception) {
            throw new Error(`Failed to find a user with the id: ${id}`);
        }   
    }
}
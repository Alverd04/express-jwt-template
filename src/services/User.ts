import { User, IUser } from "../models/User";
import { Types } from "mongoose";

class UserService {
  async createUser(data: Partial<IUser>): Promise<IUser> {
    const user = new User(data);
    await user.save();
    return user;
  }

  async getUserById(userId: Types.ObjectId): Promise<IUser | null> {
    return User.findById(userId).exec();
  }

  async updateUser(
    userId: Types.ObjectId,
    data: Partial<IUser>
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(userId, data, { new: true }).exec();
  }

  async deleteUser(userId: Types.ObjectId): Promise<IUser | null> {
    return User.findByIdAndDelete(userId).exec();
  }
}

export default new UserService();

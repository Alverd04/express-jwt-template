import { Types } from "mongoose";
import UserService from "../User";
import { IUser } from "../../models/User";

describe("User Service", () => {
  let userId: Types.ObjectId;

  it("should create a user", async () => {
    const userData: Partial<IUser> = {
      username: "testuser",
      email: "testuser@example.com",
      password_hash: "hashedpassword",
    };

    const user = await UserService.createUser(userData);
    userId = user._id;

    expect(user).toHaveProperty("_id");
    expect(user.username).toBe("testuser");
    expect(user.email).toBe("testuser@example.com");
  });

  it("should get a user by id", async () => {
    const user = await UserService.getUserById(userId);
    expect(user).not.toBeNull();
    expect(user?.username).toBe("testuser");
  });

  it("should update a user", async () => {
    const updatedUser = await UserService.updateUser(userId, {
      username: "updateduser",
    });
    expect(updatedUser).not.toBeNull();
    expect(updatedUser?.username).toBe("updateduser");
  });

  it("should delete a user", async () => {
    const deletedUser = await UserService.deleteUser(userId);
    expect(deletedUser).not.toBeNull();
    const user = await UserService.getUserById(userId);
    expect(user).toBeNull();
  });
});

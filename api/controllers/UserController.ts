import { Request, Response } from "express";
import userService from "../services/User";
import { IUser } from "../models/User";
import { Types } from "mongoose";

class UserController {
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user: Partial<IUser> = req.body;
      const newUser = await userService.createUser(user);
      res.status(201).json(newUser);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = new Types.ObjectId(req.params.id);
      const user = await userService.getUserById(userId);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = new Types.ObjectId(req.params.id);
      const user: Partial<IUser> = req.body;
      const updatedUser = await userService.updateUser(userId, user);
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = new Types.ObjectId(req.params.id);
      const deletedUser = await userService.deleteUser(userId);
      if (deletedUser) {
        res.json(deletedUser);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export default new UserController();

import express from "express";
import UserController from "../controllers/UserController";

const router = express.Router();

router.post("/", UserController.createUser);
router.get("/:id", UserController.getUserById);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export default router;

import express, { Application } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/userRoutes";
import { authenticateToken } from "./middlewares/authMiddleware";
import cors from "cors";

const app: Application = express();

dotenv.config();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use(authRoutes);
app.use("/user", authenticateToken, userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

export default app;

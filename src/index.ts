import app from "./app";
import mongoose from "mongoose";

const PORT = process.env.PORT || 5000;

const DATABASE_URL =
  process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development"
    ? process.env.MONGODB_DEV_URI
    : process.env.MONGODB_URI;

const start = async () => {
  try {
    if (DATABASE_URL) {
      await mongoose.connect(DATABASE_URL || "", {
        dbName: "rev-hub",
      });
    }
    app.listen(PORT, () =>
      console.log(`Server is running on  http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();

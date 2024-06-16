import mongoose from "mongoose";

beforeAll(async () => {
  const url = "mongodb://127.0.0.1/vlue_travel_test";
  await mongoose.connect(url);
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

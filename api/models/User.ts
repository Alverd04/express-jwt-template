import { Schema, model, Document, Types } from "mongoose";

interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password_hash: string;
  full_name: string;
  date_of_birth: Date;
  gender?: "male" | "female" | "other";
  language_spoken: string;
  travel_preferences: string;
  bio?: string;
  profile_picture?: string;
  reset_password_token?: string;
  created_at: Date;
  hasProfile?: boolean;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true, select: false },
  full_name: String,
  date_of_birth: Date,
  gender: { type: String, enum: ["M", "F", "O"] },
  language_spoken: String,
  travel_preferences: String,
  bio: String,
  profile_picture: String,
  created_at: { type: Date, default: Date.now },
  reset_password_token: String,
  hasProfile: { type: Boolean, default: false },
});

const User = model<IUser>("User", userSchema);
export { User, IUser };

import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase() {
  if (!env.mongoUri) {
    console.log("[db] MONGODB_URI not set; persistence disabled.");
    return false;
  }

  await mongoose.connect(env.mongoUri);
  console.log("[db] connected");
  return true;
}

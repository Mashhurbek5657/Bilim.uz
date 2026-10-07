import mongoose from "mongoose";

let cached = globalThis._mongoose;
if (!cached) cached = globalThis._mongoose = { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, { bufferCommands: false });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

const userSchema = new mongoose.Schema(
  {
    name: String,
    surname: String,
    className: String,
    phone: { type: String, unique: true, index: true },
    avatar: { type: String, default: "" },
    xp: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);

export const PHONE_RE = /^\+998 \d{2} \d{3} \d{2} \d{2}$/;
export const CLASS_RE = /^(1[0-1]|[1-9])[a-v]$/i;
export const NAME_RE = /^[A-Za-z\s]+$/;

export const toClient = (u) => ({
  id: u._id,
  name: u.name,
  surname: u.surname,
  className: u.className,
  phone: u.phone,
  avatar: u.avatar,
  xp: u.xp,
});
import mongoose from "mongoose";

export interface IUser {
    _id: number
    username: string
    password: string
};

const userSchema = new mongoose.Schema({
    _id: Number,
    username: { type: String, required: true },
    password: { type: String, required: true }
});

export let User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
import mongoose from "mongoose";

export interface IImage {
    item_id: number
    type: "piece" | "outfit"
    data: string
};

const imageSchema = new mongoose.Schema({
    item_id: Number,
    type: String,
    data: String
});

export let Image = mongoose.models.Image || mongoose.model<IImage>("Image", imageSchema);
import mongoose from "mongoose";

export interface IOutfit {
    _id: number
    description: string
    pieces: number[],
    user_id: number
};

const outfitSchema = new mongoose.Schema({
    _id: Number,
    description: { type: String, required: true },
    pieces: { type: [Number], required: true },
    user_id: Number
});

export let Outfit = mongoose.models.Outfit || mongoose.model<IOutfit>("Outfit", outfitSchema);
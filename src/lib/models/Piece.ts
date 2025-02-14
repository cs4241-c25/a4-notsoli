import mongoose from "mongoose";

export interface IPiece {
    _id: number
    description: string
    user_id: number
};

const pieceSchema = new mongoose.Schema({
    _id: Number,
    description: { type: String, required: true },
    user_id: Number
});

export let Piece = mongoose.models.Piece || mongoose.model<IPiece>("Piece", pieceSchema);


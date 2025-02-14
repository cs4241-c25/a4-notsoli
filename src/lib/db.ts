import mongoose from 'mongoose';
import { User } from "./models/User";
import { IPiece, Piece } from "./models/Piece";
import { IOutfit, Outfit } from "./models/Outfit";

export type GetPieceResult = {
    code: 200
    piece: IPiece
    outfits: IOutfit[]
    error?: never
} | {
    code: 400
    error: string
};

export type GetOutfitResult = {
    code: 200
    outfit: IOutfit
    pieces: IPiece[]
    error?: never
} | {
    code: 400
    error: string
};

export async function connect() {
    mongoose.connect(process.env.DB_URI!);
}

export async function login(username: string, password: string) {
    let user = await User.findOne({ username }).exec();
    console.log(user);

    if (user) {
        if (password == user.password) {
            return { code: 200, message: "Login successful", user_id: user._id };
        } else {
            return { code: 401, error: "Invalid password" };
        }
    } else {
        const user_id = await getNextUserID();
        user = new User({
            _id: user_id,
            username,
            password
        });
        await user.save();
        return { code: 201, message: "User created and logged in successfully",  user_id};
    }
}

export async function getPieces(user_id?: number): Promise<IPiece[]> {
    const query = user_id === undefined ? {} : { user_id };
    const pieces = await Piece.find(query);
    return pieces;
}

export async function getOutfits(user_id?: number): Promise<IOutfit[]> {
    const query = user_id === undefined ? {} : { user_id };
    const outfits = await Outfit.find(query);
    return outfits;
}

export async function getPiece(id: number): Promise<GetPieceResult> {
    // find piece
    const pieceResult = await Piece.findById(id);
    if (!pieceResult) return { code: 400, error: "piece does not exist"};

    // find outfits that have piece
    const outfitsResult = await Outfit.find({ pieces: id }).exec();

    return { code: 200, piece: pieceResult, outfits: outfitsResult };
}

export async function getOutfit(id: number): Promise<GetOutfitResult> {
    // find outfit
    const outfitResult = await Outfit.findById(id);
    if (!outfitResult) return { code: 400, error: "outfit does not exist"};

    // find pieces in outfit
    const piecesResult = await Piece.find({ _id: { $in: outfitResult.pieces } });

    return { code: 200, outfit: outfitResult, pieces: piecesResult };
}

export async function addPiece(data: IPiece) {
    new Piece(data).save();
}

export async function addOutfit(data: IOutfit) {
    new Outfit(data).save();
}

export async function editPiece(data: IPiece) {
    await Piece.findByIdAndUpdate(data._id, {
        description: data.description
    });
}

export async function editOutfit(data: IOutfit) {
    await Outfit.findByIdAndUpdate(data._id, {
        description: data.description,
        pieces: data.pieces
    });
}

export async function getNextUserID() {
    return await User.countDocuments({});
}

export async function getNextPieceID() {
    return await Piece.countDocuments({});
}

export async function getNextOutfitID() {
    return await Outfit.countDocuments({});
}

export async function deletePiece(id: number) {
    await Piece.findByIdAndDelete(id);
}

export async function deleteOutfit(id: number) {
    await Outfit.findByIdAndDelete(id);
}
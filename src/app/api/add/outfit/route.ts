import { getSession } from "@/lib/auth";
import { addOutfit, getNextOutfitID, addImage, connect } from "@/lib/db";

export async function POST(req: Request) {
    await connect();
    const session = await getSession();
    const body = await req.json();

    const user_id = session?.user.id;
    if (user_id == null) return new Response(
        "Not authenticated.",
        { status: 401 }
    );

    const _id = await getNextOutfitID();

    await addOutfit({
        _id,
        user_id,
        description: body.description,
        pieces: body.pieces
    });

    await addImage({
        item_id: _id,
        type: "outfit",
        data: body.data
    });

    return new Response(null, { status: 201 });
}
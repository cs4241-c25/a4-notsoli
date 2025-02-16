import { getSession } from "@/lib/auth";
import { addPiece, addImage, getNextPieceID, connect } from "@/lib/db";

export async function POST(req: Request) {
    await connect();
    const session = await getSession();
    console.log(session);
    const body = await req.json();

    const user_id = session?.user.id;
    if (user_id == null) return new Response(
        "Not authenticated.",
        { status: 401 }
    );

    const _id = await getNextPieceID();

    await addPiece({
        _id,
        user_id,
        description: body.description,
    });

    await addImage({
        item_id: _id,
        type: "piece",
        data: body.data
    });

    return new Response(null, { status: 201 });
}
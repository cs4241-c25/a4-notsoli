import { getSession } from "@/lib/auth";
import { editOutfit, connect } from "@/lib/db";

export async function POST(req: Request) {
    await connect();
    const session = await getSession();
    const body = await req.json();

    const user_id = session?.user.id;
    if (user_id == null) return new Response(
        "Not authenticated.",
        { status: 401 }
    );

    await editOutfit({
        _id: body.item_id,
        user_id,
        description: body.description,
        pieces: body.pieces
    });

    return new Response(null, { status: 201 });
}
import { getSession } from "@/lib/auth";
import { editPiece, connect } from "@/lib/db";

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

    await editPiece({
        _id: body.item_id,
        user_id,
        description: body.description,
    });

    return new Response(null, { status: 201 });
}
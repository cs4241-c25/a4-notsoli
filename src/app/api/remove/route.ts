import { getSession } from "@/lib/auth";
import { deleteOutfit, deletePiece, deleteImage, connect } from "@/lib/db";

export async function POST(req: Request) {
    await connect();
    const session = await getSession();
    const body = await req.json();

    const user_id = session?.user.id;
    if (user_id == null) return new Response(
        "Not authenticated.",
        { status: 401 }
    );

    const id = parseInt(body.id);
    if (isNaN(id)) return new Response(null, { status: 400 });

    let result;
    if (body.type == "piece") {
        result = await deletePiece(id, user_id);
    } else if (body.type == "outfit") {
        result = await deleteOutfit(id, user_id);
    } else {
        return new Response(null, { status: 400 });
    }

    if (result.deletedCount == 0)
        return new Response(null, { status: 400 });

    await deleteImage(body.type, id);

    return new Response(null, { status: 201 });
}
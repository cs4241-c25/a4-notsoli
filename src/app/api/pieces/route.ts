import { getSession } from "@/lib/auth";
import { getPieces, connect } from "@/lib/db";

export async function GET() {
    await connect();
    const session = await getSession();
    const pieces = await getPieces(session?.user.id);
    return Response.json(pieces);
}
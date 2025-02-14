import { getSession } from "@/lib/auth";
import { getOutfits, connect } from "@/lib/db";

export async function GET() {
    await connect();
    const session = await getSession();
    const outfits = await getOutfits(session?.user.id);
    return Response.json(outfits);
}
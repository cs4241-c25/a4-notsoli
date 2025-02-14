import { getPiece, connect } from "@/lib/db";
import ItemPage from "../../ItemPage";

export default async function Piece({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = parseInt((await params).id);
    await connect();
    const data = await getPiece(id);

    return(
        <ItemPage type="piece" data={data} />
    )
}
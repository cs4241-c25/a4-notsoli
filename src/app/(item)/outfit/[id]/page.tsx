import { getOutfit, connect } from "@/lib/db";
import ItemPage from "../../ItemPage";

export default async function Outfit({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = parseInt((await params).id);
    await connect();
    const data = await getOutfit(id);

    return(
        <ItemPage type="outfit" data={data} />
    )
}
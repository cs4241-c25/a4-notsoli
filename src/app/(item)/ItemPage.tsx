import { GetOutfitResult, GetPieceResult } from "@/lib/db";
import Item from "@/components/Item";

export default function ItemPage({
		type, data
	}: {
		type: "outfit" | "piece"
		data: GetOutfitResult | GetPieceResult
	}) {
		if (data.code !== 200) {
			return (
				<main>
					<p>Error fetching item: {data.error}</p>
				</main>
			)
		} else {
			const item = "outfit" in data ? data.outfit : data.piece;
			const items = "outfits" in data ? data.outfits : data.pieces;

			return (
				<main className="flex m-4 h-full">
					<section id="item" className="w-[50%] flex flex-col gap-2">
						<h1>{type == "outfit" ? "Outfit" : "Piece"}</h1>
						<img src={`/images/${type}s/${item._id}`} alt={item.description} className="flex-grow h-0 object-contain" />
						<p>{item.description}</p>
					</section>
					<section id="related-items" className="w-[50%] flex flex-col">
						<h1>Related {type == "outfit" ? "Piece" : "Outfit"}s</h1>
						<ul className="flex-grow flex flex-wrap gap-[5%] overflow-scroll">
							{ items.map((itm, idx) => (
								<li className={type == "outfit" ? "h-[20em]" : "h-[30em]"} key={idx}>
									<a href={`/${type == "outfit" ? "piece" : "outfit"}/${itm._id}`} className="w-full h-full block">
										<Item item={itm} type={type == "outfit" ? "piece" : "outfit"} />
									</a>
								</li>
							))}
						</ul>
					</section>
				</main>
			);
		}
	}
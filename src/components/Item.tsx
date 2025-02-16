import { IPiece } from "@/lib/models/Piece";
import { IOutfit } from "@/lib/models/Outfit";

export default function Item({
    type, item
}: {
    type: "piece" | "outfit",
    item: IPiece | IOutfit
}) {
    return (
        <div className={type + " relative group item w-full h-full"}>
            <img
                src={`/images/${type}s/${item._id}`}
                alt={item.description}
                className="w-full h-full object-contain object-center"/
            >
            <div className="absolute inset-0 bg-[--bg-trans] hidden items-center justify-center z-10 group-hover:flex">
                <p className="w-40 text-center">{item.description}</p>
            </div>
        </div>
    )
}
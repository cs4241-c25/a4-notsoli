"use client";

import Toggle from "@/components/Toggle";
import Item from "@/components/Item";

import { useEffect, useState } from "react";
import { IPiece } from "@/lib/models/Piece";
import { IOutfit } from "@/lib/models/Outfit";

export default function Manage() {
    const [pieces, setPieces] = useState<IPiece[]>([]);
    const [outfits, setOutfits] = useState<IOutfit[]>([]);
    const [getItemsStatus, setGetItemsStatus] = useState("");

    const [type, fSetType] = useState<"piece" | "outfit">("piece");
    function setType(v: unknown) {
        const newType = v as "piece" | "outfit";
        select(null);
        fSetType(newType);
    }

    const [action, fSetAction] = useState<"add" | "edit">("add");
    function setAction(v: unknown) {
        const newAction = v as "add" | "edit";
        select(null);
        fSetAction(newAction)
    }

    const [selected, fSelect] = useState<IOutfit | IPiece | null>(null);

    function select(item: typeof selected) {
        document.querySelectorAll<HTMLInputElement>('input[type=radio]')
        .forEach( el => el.checked = el.value == item?._id.toString());

        document.querySelectorAll<HTMLInputElement>('input[type=checkbox]')
        .forEach( el => {
            if (action == "edit" && item != null && "pieces" in item)
                el.checked = item.pieces.includes(parseInt(el.value));
            else el.checked = false
        });

        fSelect(item);
    }

    function add(data: FormData) {
        
    }

    function edit(data: FormData) {

    }

    function remove(item: typeof selected) {

    }

    useEffect(() => {
        const fetchPieces = async () => {
            const result = await fetch("/api/pieces", { method: "GET" });
            if (result.ok) {
                setPieces(await result.json());
            } else {
                setGetItemsStatus("Failed to fetch items");
            }
        }

        const fetchOutfits = async () => {
            const result = await fetch("/api/outfits", { method: "GET" });
            if (result.ok) {
                setOutfits(await result.json());
            } else {
                setGetItemsStatus("Failed to fetch items");
            }
        }

        setGetItemsStatus("Fetching items...");
        Promise.all([fetchPieces(), fetchOutfits()]).then(() => {
            setGetItemsStatus("");
        })
    }, []);
    
    return (
        <main className="flex flex-col gap-4">
            <section className="flex gap-4 justify-center">
                <Toggle
                    values={["piece", "outfit"]}
                    labels={["Piece", "Outfit"]}
                    setValue={setType}
                />
                <Toggle
                    values={["add", "edit"]}
                    labels={["Add", "Edit/Remove"]}
                    setValue={setAction}
                />
            </section>
            <section className="flex justify-center">
                <form action={action == "add" ? add : edit} className="flex flex-col [&_h2]:mt-4 [&_h2]:mb-2 w-[90%] max-w-[32em]">
                    <h2>{action == "add" ? "Add" : "Edit"} {type}:</h2>
                    { action == "edit" &&
                        <ul className="flex flex-wrap gap-2 p-2">
                            { (type == "outfit" ? outfits : pieces).map((p, i) => (
                                <li className="w-40 h-40" key={i}>
                                    <label htmlFor={`select-${type}-${p._id}`} className="block w-full h-full has-[:checked]:bg-white rounded-md">
                                        <Item type={type} item={p} />
                                        <input
                                            type="radio" name="selected"
                                            id={`select-${type}-${p._id}`} value={p._id}
                                            className="hidden"
                                            onChange={() => select(p)}
                                        />
                                    </label>
                                </li>
                            ))}
                        </ul>
                    }
                    <label htmlFor="image"><h2>Image:</h2></label>
                    <input type="file" name="image" id="image" />
                    <label htmlFor="description"><h2>Description:</h2></label>
                    <textarea
                        name="description" id="description" className="w-[20em]"
                        defaultValue={(action == "edit" && selected != null) ? selected.description : ""}
                    />
                    { type == "outfit" && <h2>Items:</h2>}
                    { type == "outfit" && 
                        <ul className="flex flex-wrap gap-2 p-2">
                            { pieces.map((p, i) => (
                                <li className="w-40 h-40" key={i}>
                                    <label htmlFor={`piece-${p._id}`} className="block w-full h-full has-[:checked]:bg-white rounded-md">
                                        <Item type="piece" item={p} />
                                        <input
                                            type="checkbox" name="piece"
                                            id={`piece-${p._id}`} value={p._id}
                                            className="hidden"
                                        />
                                    </label>
                                </li>
                            ))}
                        </ul>
                    }
                    <div className="flex gap-4">
                        <button type="submit">{action == "add" ? "Add" : "Edit"}</button>
                        { action == "edit" &&
                        <button onClick={() => remove(selected)}>Remove</button>}
                    </div>
                </form>
            </section>
        </main>
    )
}
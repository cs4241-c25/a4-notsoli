"use client";

import Toggle from "@/components/Toggle";
import Item from "@/components/Item";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IPiece } from "@/lib/models/Piece";
import { IOutfit } from "@/lib/models/Outfit";

export default function Manage() {
    const router = useRouter();

    const [pieces, setPieces] = useState<IPiece[]>([]);
    const [outfits, setOutfits] = useState<IOutfit[]>([]);

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

    async function toBase64(file: File) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });
    };

    async function add(data: FormData) {
        const item = {
            description: data.get("description"),
            data: await toBase64(data.get("image") as File),
            pieces: (type == "piece") ? [] : 
                data.getAll("piece").map((p) => parseInt(p as string))
        }
        
        const response = await fetch(`/api/add/${type}`, {
            method: "POST",
            body: JSON.stringify(item)
        });

        if (response.ok) router.push("/");
    }

    async function edit(data: FormData) {
        if (!selected) return;

        const item = {
            item_id: selected._id.toString(),
            description: data.get("description"),
            pieces: (type == "piece") ? [] : 
                data.getAll("piece").map((p) => parseInt(p as string))
        }

        const response = await fetch(`/api/edit/${type}`, {
            method: "POST",
            body: JSON.stringify(item)
        });

        if (response.ok) router.push("/");
    }

    async function remove(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        if (!confirm(`Are you sure you want to remove this ${type}?`)) return;

        if (!selected) return;

        const response = await fetch("/api/remove", {
            method: "POST",
            body: JSON.stringify({
                type,
                id: selected!._id
            })
        });

        if (response.ok) router.push("/");
    }

    useEffect(() => {
        const fetchPieces = async () => {
            const result = await fetch("/api/pieces", { method: "GET" });
            if (result.ok) setPieces(await result.json());
        }

        const fetchOutfits = async () => {
            const result = await fetch("/api/outfits", { method: "GET" });
            if (result.ok) setOutfits(await result.json());
        }

        fetchPieces();
        fetchOutfits();
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
                    { action == "add" && 
                        <div>
                            <label htmlFor="image"><h2>Image:</h2></label>
                            <input type="file" name="image" id="image" />
                        </div>
                    }
                    <label htmlFor="description"><h2>Description:</h2></label>
                    <textarea
                        name="description" id="description"
                        defaultValue={(action == "edit" && selected != null) ? selected.description : ""}
                        className="w-[20em] rounded-md border-[2px] border-[--mg]"
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
                    <div className="flex gap-4 my-4 underline">
                        <button type="submit">{action == "add" ? "Add" : "Edit"} {type}</button>
                        { action == "edit" &&
                        <button onClick={remove}>Remove {type}</button>}
                    </div>
                </form>
            </section>
        </main>
    )
}
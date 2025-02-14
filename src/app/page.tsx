"use client";

import Toggle from "@/components/Toggle";
import { CSSProperties, useEffect, useState } from "react";
import { IPiece } from "@/lib/models/Piece";
import { IOutfit } from "@/lib/models/Outfit";
import Item from "../components/Item"

export default function Home() {
  const [pieces, setPieces] = useState<IPiece[]>([]);
  const [outfits, setOutfits] = useState<IOutfit[]>([]);
  const [getItemsStatus, setGetItemsStatus] = useState("");

  const [type, fSetType] = useState<"piece" | "outfit">("piece");
  function setType(v: unknown) { fSetType(v as "piece" | "outfit") }

  const [style, fSetStyle] = useState<"pile" | "grid">("pile");
  function setStyle(v: unknown) { fSetStyle(v as "pile" | "grid") }

  function generatePosition() {
    const properties: CSSProperties = {
      position: "absolute"
    };

    const x = Math.random();
    const y = Math.random();

    if (x < 0.5) properties.left = x * 100 + "%";
    else properties.right = (1-x) * 100 + "%";

    if (y < 0.5) properties.top = y * 100 + "%";
    else properties.bottom = (1-y) * 100 + "%";

    return properties;
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
    <main className="flex flex-col h-full gap-4">
      <section id="options" className="flex gap-4 justify-center">
        <Toggle
          values={["piece", "outfit"]}
          labels={["Piece", "Outfit"]}
          setValue={setType}
        />
        <Toggle
          values={["pile", "grid"]}
          labels={["Pile", "Grid"]}
          setValue={setStyle}
        />
      </section>
      <section className="flex-grow">
        { getItemsStatus == "" &&
          <ul id="items" className="flex flex-wrap w-[80%] h-[80%] m-auto relative">
            { ( type == "piece" ? pieces : outfits).map((p, i) => (
                <li key={i} className="w-fit h-60" style={style == "pile" ? generatePosition() : {}}>
                  <a className="block w-full h-full" href={`${type}/${p._id}`}><Item type={type} item={p}/></a>
                </li>
              ))
            }
          </ul>
        }
        { getItemsStatus != "" && 
          <p className="text-center mt-4">{getItemsStatus}</p>
        }
      </section>
    </main>
  );
}

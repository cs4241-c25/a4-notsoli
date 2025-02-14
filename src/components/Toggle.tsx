import { useState } from "react";

export default function Toggle({
    values, labels, setValue
}: {
    values: unknown[],
    labels: string[]
    setValue: (v: unknown) => void
}) {
    const [index, setIndex] = useState(0);

    function cycle() {
        const newIndex = (index + 1) % values.length;
        setIndex(newIndex);
        setValue(values[newIndex]);
    }

    return (
        <button className="toggle flex p-1 bg-[--mg] rounded-sm" onClick={cycle}>
            {labels.map((v, i) => (
                <p key={i} className={(index == i && "bg-[--bg]") + " p-1 rounded-sm"}>{v}</p>
            ))}
        </button>
    )
}
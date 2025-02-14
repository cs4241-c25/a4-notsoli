"use client";

import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react";

export default function AccountButton() {
    const { data: session, status } = useSession();

    if (status === "authenticated")
        return (<button onClick={() => signOut()}>Logout</button>)

    return (<a href="/account">Login/Register</a>)
}
"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Account() {
    const router = useRouter();
    const [loginStatus, setLoginStatus] = useState("");
    
    async function submit(data: FormData) {
        setLoginStatus("Logging in...");

        const username = data.get("username");
        const password = data.get("password");

        const result = await signIn('credentials', { redirect: false, username, password });
        if (!result || !result.ok) {
            setLoginStatus("Login failed: Invalid credentials");
        } else {
            router.push("/");
        }
    }

    return (
        <main>
            <form action={submit}>
                <label htmlFor="username">Username:</label>
                <input type="text" name="username" id="username" required />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" required />
                <button type="submit">Login/Register</button>
                <p>{loginStatus}</p>
            </form>
        </main>
    )
}
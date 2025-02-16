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
        <main className="flex flex-col w-full h-full justify-center items-center">
            <h2>Login/Register</h2>
            <form action={submit} className="flex flex-col w-[20em]">
                <label htmlFor="username" className="mt-4 mb-1">Username:</label>
                <input type="text" name="username" id="username" required 
                    className="rounded-md border-[2px] border-[--mg] p-0.5" />
                <label htmlFor="password" className="mt-4 mb-1">Password</label>
                <input type="password" name="password" id="password" required
                    className="rounded-md border-[2px] border-[--mg] p-0.5" />
                <button type="submit" className="underline my-4">Login/Register</button>
                <p>{loginStatus}</p>
            </form>
        </main>
    )
}
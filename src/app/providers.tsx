/* this component allows us to get around the Next.js restriction on
 * client components in the root layout. it allows us to get the auth
 * session in both client and server components, without unnecessarily
 * estricting what pages are rendered on the server. */

"use client"

import type { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"

export default function Providers({ session, children }: { session: Session | null, children: React.ReactNode }) {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}
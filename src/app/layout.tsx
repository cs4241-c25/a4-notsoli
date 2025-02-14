import type { Metadata } from "next";
import { getSession } from "@/lib/auth"
import "./globals.css";

import Providers from "./providers";
import AccountButton from "./account/AccountButton";

export const metadata: Metadata = {
  title: "Sam's Closet",
  description: "Create your own personal fashion archive.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // get auth session and make it accessible to components
  const session = await getSession()

  return (
    <html lang="en" className="h-full">
      <body className=" flex flex-col h-full">
        <Providers session={session}>
          <nav>
            <ul className="flex justify-between align-center m-4">
              <li><AccountButton /></li>
              <li><a href="/"><h1>Sam's Closet</h1></a></li>
              <li><a href="/manage">Manage Items</a></li>
            </ul>
          </nav>
          {children}
        </Providers>
      </body>
    </html>
  );
}

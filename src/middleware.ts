export { default } from "next-auth/middleware";

// Protect the "scrapbooks" and "profile" pages from unauthenticated users
export const config = { matcher: ["/manage"] }
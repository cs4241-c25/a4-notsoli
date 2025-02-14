import { AuthOptions, getServerSession } from "next-auth"
import Credentials from "next-auth/providers/credentials";
import { login, connect } from "./db";

const authOptions: AuthOptions = {
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text"},
                password: {  label: "Password", type: "password" }
            },
            async authorize(credentials, _req) {
                await connect();
                if (!credentials) return null;

                const loginResult = await login(credentials.username, credentials.password);

                if (loginResult.code == 200 || loginResult.code == 201) {
                    return {
                        id: loginResult.user_id!,
                        name: credentials.username
                    }
                } else {
                    return null;
                }
            },
        })
    ],
    pages: {
        signIn: "/account",
        newUser: "/"
    },
    callbacks: {
        // Modify these if we want additional user information on top of name, email, and image
        async session({ session, token }: { session: any; token: any }) {
            if (token) {
                session.user.name = token.name;
                session.user.id = token.id;
            }
            return session;
        },
        async jwt({ token, user }: {token: any; user: any}) {
            if (user) {
                token.name = user.name;
                token.id = user.id;
            }
            return token;
        },
    }
};

/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }
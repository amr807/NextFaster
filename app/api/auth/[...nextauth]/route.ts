import NextAuth from "next-auth";
import { handler } from "./opition";

const handlers = NextAuth(handler);
export { handlers as GET, handlers as POST };

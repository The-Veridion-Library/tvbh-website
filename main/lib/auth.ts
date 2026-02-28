import { betterAuth } from "better-auth";
import { openAPI, admin, username } from "better-auth/plugins";
import { passkey } from "@better-auth/passkey"
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  baseURL: process.env.BETTER_AUTH_BASE_URL,
  plugins: [
    openAPI(),
    passkey(),
    admin(),
    username()
  ],
  emailAndPassword: { 
    enabled: true, 
  }, 
});
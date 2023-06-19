import getEnvVar from "./env"
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config()

const databaseUrl = getEnvVar("PUBLIC_SUPABASE_URL")
const databaseKey = getEnvVar("PUBLIC_SUPABASE_KEY")

const supabaseClient = createClient(databaseUrl, databaseKey, {
    auth: { persistSession: false }
})

export { supabaseClient }

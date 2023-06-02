import getEnvVar from "../util/env"
import mongoose from "mongoose"

const mongoDBUri = getEnvVar("MONGO_DB_URI")

async function connnectDB() {
    await mongoose.connect(mongoDBUri)
}

export default connnectDB

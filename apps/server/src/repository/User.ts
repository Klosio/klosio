import userSchema from "../db/schema/userSchema"
import mongoose from "mongoose"

const User = mongoose.model("User", userSchema)

export default User

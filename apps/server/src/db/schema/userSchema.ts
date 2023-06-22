import organizationSchema from "./organizationSchema"
import { Schema } from "mongoose"

const userSchema = new Schema({
    auth_id: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    organization: {
        type: organizationSchema,
        required: false
    }
})

export default userSchema

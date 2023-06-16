import { Schema } from "mongoose"

const organizationSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

export default organizationSchema

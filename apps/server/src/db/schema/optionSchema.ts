import { Schema } from "mongoose"

const optionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: String
    }
})

export default optionSchema

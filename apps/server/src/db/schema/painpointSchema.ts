import { Schema } from "mongoose"

const painpointSchema = new Schema({
    organization_id: {
        type: String,
        required: true
    },
    painpoint: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
})

export default painpointSchema

import mongoose, { Schema } from "mongoose"

const painpointsSchema = new Schema({
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

const Painpoints = mongoose.model("Painpoints", painpointsSchema)

export default Painpoints

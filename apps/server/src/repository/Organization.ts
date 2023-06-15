import mongoose from "mongoose"

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

const Organization = mongoose.model("Organization", organizationSchema)

export default Organization

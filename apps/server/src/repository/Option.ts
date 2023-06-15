import mongoose from "mongoose"

const optionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: String
    }
})

const Option = mongoose.model("Option", optionSchema)

export default Option

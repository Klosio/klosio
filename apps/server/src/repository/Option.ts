import optionSchema from "../db/schema/optionSchema"
import mongoose from "mongoose"

const Option = mongoose.model("Option", optionSchema)

export default Option

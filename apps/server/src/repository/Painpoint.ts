import painpointSchema from "../db/schema/painpointSchema"
import mongoose from "mongoose"

const Painpoint = mongoose.model("Painpoint", painpointSchema)

export default Painpoint

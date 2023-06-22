import organizationSchema from "../db/schema/organizationSchema"
import mongoose from "mongoose"

const Organization = mongoose.model("Organization", organizationSchema)

export default Organization

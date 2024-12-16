import mongoose from "mongoose";

const updateTimeSchema = new mongoose.Schema({
    company_name: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("UpdateTime", updateTimeSchema);

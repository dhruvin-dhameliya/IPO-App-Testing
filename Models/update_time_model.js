import mongoose from "mongoose";

const updateTimeSchema = new mongoose.Schema({
    company_name: { type: String, required: true },
    updated_at: { type: Date, default: Date.now }
});

export default mongoose.model("UpdateTime", updateTimeSchema);

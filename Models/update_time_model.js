import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const updateTimeSchema = new mongoose.Schema({
    company_name: { type: String, required: true },
    updated_at: { type: Date, default: Date.now }
});

export default mongoose.model("UpdateTime", updateTimeSchema);

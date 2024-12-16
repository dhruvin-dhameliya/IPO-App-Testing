import mongoose from "mongoose";

const IpoSchema = new mongoose.Schema({
    company_id: { type: String, require: true },
    company_name: { type: String, require: true },
    registrar_name: { type: String, require: true }
});

const IpoModel = new mongoose.model("IpoCompany", IpoSchema);

export default IpoModel;
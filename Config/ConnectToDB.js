import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const ConnectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("DB Connection Error: " + error);
    }
};

export default ConnectToDB;
import mongoose from "mongoose";

const ConnectToDB = async () => {
    try {
        await mongoose.connect("mongodb://mongo:uWRKbleovlBxRryoAXRxcnbLlHlhCPrQ@autorack.proxy.rlwy.net:37025");
        console.log("Database connected successfully");
    } catch (error) {
        console.error("DB Connection Error: " + error);
    }
};

export default ConnectToDB;
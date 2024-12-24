import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ConnectToDB from "./Config/ConnectToDB.js";
import ipoResultRoute from "./Routes/ipoResultRoute.js";
import schedulingTask from "./Tasks/trigger-fetch-ipo-allotment.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

ConnectToDB();
schedulingTask();

app.get("/", (req, res) => {
    res.status(200).send("Welcome to the IPO Tracking App");
});


app.use("/api", ipoResultRoute);

const port = process.env.PORT || 5050;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
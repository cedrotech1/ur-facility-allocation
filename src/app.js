import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import fileUploader from "express-fileupload";
import cors from "cors";

import router from "./routers";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUploader({ useTempFiles: true }));

// welcome message
app.get("/", (req, res) => {
  res.json({ message: "Welcome to UR Faclities Allocation API" });
});

app.use("/api/v1", router);

export default app;

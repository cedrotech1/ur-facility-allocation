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

const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');



// Set up multer for file upload
const upload = multer({ dest: 'uploads/' }); // Files will be stored in the uploads/ directory

// Route to upload CSV file
app.post('/upload-csv', upload.single('file'), (req, res) => {
    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const results = [];
    const csvFilePath = req.file.path; // Get the path of the uploaded file

    // Read and parse the CSV file
    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => results.push(data)) // Push each row of data to results
        .on('end', () => {
            // Remove the uploaded file after reading (optional)
            fs.unlinkSync(csvFilePath);
            // Send the results as a JSON response
            res.json(results);
        })
        .on('error', (error) => {
            res.status(500).send('Error reading the CSV file: ' + error.message);
        });
});


app.use("/api/v1", router);

export default app;

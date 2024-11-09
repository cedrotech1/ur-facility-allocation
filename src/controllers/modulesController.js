import {
  saveModulesData,
  getModules,
  deleteModule,
  updateOneModule,
  getProgramIDByName

} from "../services/moduleService.js";


import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import xlsx from 'xlsx';  // Import the xlsx package

export const processModules = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileExtension = path.extname(req.file.originalname).toLowerCase();
  
  // Only allow .xlsx and .xls files
  if (fileExtension !== '.xlsx' && fileExtension !== '.xls') {
    return res.status(400).send('Invalid file format. Please upload an Excel file.');
  }

  const results = [];
  const filePath = req.file.path;

  try {
    const workbook = xlsx.readFile(filePath);  // Read the Excel file
    const sheetName = workbook.SheetNames[0];  // Use the first sheet (you can modify this if needed)
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet to JSON (array of objects)
    const excelData = xlsx.utils.sheet_to_json(sheet);

    // Extract necessary data from the Excel file
    excelData.forEach((data) => {
      const moduleData = {
        major: data['Major Area (STEM/NON STEM)'],
        subjectCode: data['Subject Code'],
        subjectName: data['Subject Name'],
        yearOfStudy: parseInt(data['Year of Study (1,2,3,4)'], 10),
        blocks: data['Blocks (S1,S2)'],
        credits: parseInt(data['Credits'], 10),
        majorElective: data['Major/Elective'],
        programID: data['programID'],
      };

      results.push(moduleData);
    });

    fs.unlinkSync(filePath);  // Remove the uploaded file after processing
    await saveAndRespond(results, res);

  } catch (error) {
    console.error('Error reading the Excel file:', error.message);
    return res.status(500).send('Error reading the Excel file: ' + error.message);
  }
};

const saveAndRespond = async (results, res) => {
  try {
    const { createdModules, duplicateModules } = await saveModulesData(results);
    return res.json({
      message: 'Modules processed successfully.',
      createdModules,
      duplicateModules: duplicateModules.length > 0 
        ? `Duplicate modules skipped: ${duplicateModules.join(', ')}`
        : 'No duplicates found'
    });
  } catch (error) {
    console.error('Error saving modules data:', error.message);
    return res.status(500).send('Error saving modules data: ' + error.message);
  }
};


export const getAllModules = async (req, res) => {
  try {
    let modules = await getModules();

    return res.status(200).json({
      success: true,
      message: "modules retrieved successfully",
      modules,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};


export const deleteOneModule = async (req, res) => {
  try {
    const module = await deleteModule(req.params.id);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "module not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "module deleted successfully",
      module,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};


export const updateModule = async (req, res) => {
  try {
    const module = await updateOneModule(req.params.id, req.body);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "module not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "module updated successfully",
      updatedModule: module,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};
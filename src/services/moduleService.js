import db from "../database/models";
const FacilitiesModel = db["Facility"];
const Users = db["Users"];
const GroupModel = db["Groups"];
const IntakeModel = db["Intake"];
const ProgramModel = db["program"];
const DepartmentModel = db["department"];
const SchoolModel = db["School"];
const CollegeModel = db["college"];
const DefaultGroupModel = db["DefaultGroup"]; 
const campusModel = db["Campus"];
const TimeModel = db["Time"];
const ModulesModel = db["Module"];
import sequelize, { Op } from "sequelize";



export const extractFacilitiesData = async (facilities) => {
  const createdFacilities = []; // Array to hold successfully created facilities

  for (const facility of facilities) {
    try {
      // Create a new facility in the database
      const newFacility = await FacilitiesModel.create({
        campus_id: facility.campus_id,
        name: facility.name,
        location: facility.location,
        size: facility.size,
        category: facility.category,
        status: facility.status
      });
      createdFacilities.push(newFacility); // Add the created facility to the array
    } catch (error) {
      console.error(`Error creating facility: ${error.message}`);
      
    }
  }

  return createdFacilities; // Return the array of created facilities
};

export const saveModulesData = async (modules) => {
  const createdModules = [];
  const duplicateModules = [];

  for (const module of modules) {
    try {
      // Check for existing module by subject code and program ID
      const existingModule = await ModulesModel.findOne({
        where: { subjectCode: module.subjectCode, programID: module.programID }
      });

      if (existingModule) {
        console.warn(`Module already exists in database: ${module.subjectCode}`);
        duplicateModules.push(module.subjectCode); // Add to duplicate list
        continue; // Skip if module already exists
      }

      // Create a new module in the database
      const newModule = await ModulesModel.create({
        majorArea: module.major,
        subjectCode: module.subjectCode,
        subjectName: module.subjectName,
        yearOfStudy: module.yearOfStudy,
        blocks: module.blocks,
        credits: module.credits,
        majorElective: module.majorElective,
        programID: module.programID,
      });

      createdModules.push(newModule); // Add the created module to the array
    } catch (error) {
      console.error(`Error creating module: ${error.message}`);
      // Handle errors for specific records as needed
    }
  }

  return {
    createdModules,
    duplicateModules,
  }; // Return both created and duplicate modules
};


export const getModules = async () => {
  const allModules = await ModulesModel.findAll({
    include: [    
      {
        model: ProgramModel,
        as: "program",
      },]
  }
    
  );
  return allModules;
};

export const updateOneModule = async (id, module) => {
  const moduleToUpdate = await ModulesModel.findOne({ where: { id } });
  if (moduleToUpdate) {
    await ModulesModel.update(module, { where: { id } });
    return moduleToUpdate;
  }
  return null;
};

export const deleteModule = async (id) => {
  const ModuleDelete = await ModulesModel.findOne({ where: { id } });
  if (ModuleDelete) {
    await ModulesModel.destroy({ where: { id } });
    return ModuleDelete;
  }
  return null;
};


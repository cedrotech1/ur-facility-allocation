import {
  createprogram,
  // getOneDepartmentWithDetails,
  deleteprogram,
  allprograms,
  updateprogram,
  checkExistingProgramByid,
  check,
  getOneProgramWithDetails,
} from "../services/programService.js";
import { checkprivileges } from "../helpers/privileges";
import { checkExistingDepartmentById } from "../services/departmentService.js";

export const programWithAll = async (req, res) => {
  try {
    const userCampusId = req.user.campus;
    let data = await allprograms();

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Programs not found",
      });
    }

    data = data?.filter(
      (program) => program?.department?.School?.college?.Campus.id === userCampusId
    );

    return res.status(200).json({
      success: true,
      message: "Programs retrieved successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const addprogram = async (req, res) => {
  try {
    if (!checkprivileges(req.user.privileges, "manage-programs")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    // Extract name and id from req.body
    req.body.name = req.body.name.toUpperCase();
    const department_ID = req.body.department_ID;

    // Check if name and campus_id are not provided
    if (!req.body.name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }
    if (!department_ID) {
      return res.status(400).json({
        success: false,
        message: "department_ID is required",
      });
    }
    if(!req.body.description){
      return res.status(400).json({
        success: false,
        message: "description is required",
      });
    }

    const existingDepartment = await checkExistingDepartmentById(department_ID);
    if (!existingDepartment) {
      return res.status(400).json({
        success: false,
        message: "Department not exists ",
      });
    }

    const existingprogram1 = await check(
      req.body.name.toUpperCase(),
      department_ID
    );

    if (existingprogram1) {
      console.log(
        "program with the same name already exists in that department"
      );
      return res.status(400).json({
        success: false,
        message: "program with the same name already exists in that department",
      });
    }

    // Continue with the process if name and valid campus_id are provided
    const newprogram = await createprogram(req.body);
    return res.status(201).json({
      success: true,
      message: "program created successfully",
      program: newprogram,
    });
  } catch (error) {
    console.log(error);
    console.error("Error adding program:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const deleteOneprogram = async (req, res) => {
  try {
    if (!checkprivileges(req.user.privileges, "manage-programs")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    const program = await deleteprogram(req.params.id);
    if (!program) {
      return res.status(404).json({
        success: false,
        message: "program not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "program deleted successfully",
      program,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const getOneprogram = async (req, res) => {
  try {
    const { id } = req.params;
    const userCampusId = req.user.campus;
    let data = await getOneProgramWithDetails(id);

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Programs not found",
      });
    }

    if (!Array.isArray(data)) {
      data = [data];
    }
    data = data.filter(
      (program) => program.department.School.college.Campus.id === userCampusId
    );

    return res.status(200).json({
      success: true,
      message: "program retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};
export const updateOneprogram = async (req, res) => {
  try {
    if (!checkprivileges(req.user.privileges, "manage-programs")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    // Extract name and id from req.body
    req.body.name = req.body.name.toUpperCase();
    const department_ID = req.body.department_ID;
    const description = req.body.description;

    // Check if name and campus_id are not provided
    if (!req.body.name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }
    if (!description) {
      return res.status(400).json({
        success: false,
        message: "description is required",
      });
    }
    if (!department_ID) {
      return res.status(400).json({
        success: false,
        message: "department_ID is required",
      });
    }
    const existingprogram1 = await check(
      req.body.name.toUpperCase(),
      department_ID
    );

    if (existingprogram1) {
      console.log(
        "program with the same name already exists in that department"
      );
      return res.status(400).json({
        success: false,
        message: "program with the same name already exists in that department",
      });
    }

    const existingprogram = await checkExistingProgramByid(department_ID);
    if (!existingprogram) {
      console.log("program not exists ");
      return res.status(400).json({
        success: false,
        message: "program not exists ",
      });
    }
    const program = await updateprogram(req.params.id, req.body);
    if (!program) {
      return res.status(404).json({
        success: false,
        message: "program not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "program updated successfully",
      program,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

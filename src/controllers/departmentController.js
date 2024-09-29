import {
  createdepartment,
  deletedepartment,
  getOneDepartmentWithDetails,
  updatedepartment,
  alldepartments,
  checkExistingDepartment,
  checkExistingSchoolByid,
} from "../services/departmentService.js";
import { checkprivileges } from "../helpers/privileges";


export const adddepartment = async (req, res) => {
  let newdepartment; 
  try {
    if (!checkprivileges(req.user.privileges, "manage-departments")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

   
    req.body.name = req.body.name.toUpperCase();
    const school_ID = req.body.school_ID;

  
    if (!req.body.name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }
    if (!school_ID) {
      return res.status(400).json({
        success: false,
        message: "school_ID is required",
      });
    }

    // Check if school exists
    const existingSchool = await checkExistingSchoolByid(school_ID);
    if (!existingSchool) {
      console.log("School not exists ");
      return res.status(400).json({
        success: false,
        message: "School not exists ",
      });
    }

    const existingdepartment = await checkExistingDepartment(
      req.body.name.toUpperCase(),
      school_ID
    );

    if (existingdepartment) {
      console.log(
        "Department with the same name already exists in that school"
      );
      return res.status(400).json({
        success: false,
        message: "Department with the same name already exists in that school",
      });
    }

    // Continue with the process if name and valid campus_id are provided
    newdepartment = await createdepartment({
      name: req.body.name,
      school_ID: school_ID,
    });

    return res.status(201).json({
      success: true,
      message: "Department created successfully !! ",
      department: newdepartment,
    });
  } catch (error) {
    console.log(error);
    console.error("Error adding department:", error);
    if (newdepartment) {
      await newdepartment.destroy(); // Roll back department creation in case of an error
    }
    return res.status(500).json({
      // message: "Something went wrong",
      error,
    });
  }
};

export const deleteOnedepartment = async (req, res) => {
  try {
    if (!checkprivileges(req.user.privileges, "manage-departments")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const department = await deletedepartment(req.params.id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "department not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "department deleted successfully",
      department,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const departmentWithAll = async (req, res) => {
  try {
    const userCampusId = req.user.campus;
    let data = await alldepartments(); 
    data = data.filter(department =>
      department.School.college.Campus.id === userCampusId
    );

    return res.status(200).json({
      success: true,
      message: "Departments retrieved successfully",
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


export const getOnedepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const userCampusId = req.user.campus;
    let  data = await getOneDepartmentWithDetails(id);

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Departments not found",
      });
    }
    if (!Array.isArray(data)) {
      data = [data];
    }
    
  
    data = data.filter(department =>
      department.School.college.Campus.id === userCampusId
    );

    return res.status(200).json({
      success: true,
      message: "Department retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("Error retrieving department:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while retrieving the department",
      error: error.message,
    });
  }
};

export const updateOnedepartment = async (req, res) => {
  try {
    
    if (!checkprivileges(req.user.privileges, "manage-departments")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    // Extract name and id from req.body
    req.body.name = req.body.name.toUpperCase();
    const school_ID = req.body.school_ID;

    // Check if name and campus_id are not provided
    if (!req.body.name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }
    if (!school_ID) {
      return res.status(400).json({
        success: false,
        message: "school_ID is required",
      });
    }

    // Check if school exists
    const existingSchool = await checkExistingSchoolByid(school_ID);
    if (!existingSchool) {
      console.log("School not exists ");
      return res.status(400).json({
        success: false,
        message: "School not exists ",
      });
    }
    // Check if the department with the same name already exists for the specified campus_id
    const existingdepartment = await checkExistingDepartment(
      req.body.name,
      school_ID
    );

    if (existingdepartment) {
      console.log(
        "Department with the same name already exists in that school"
      );
      return res.status(400).json({
        success: false,
        message: "Department with the same name already exists in that school",
      });
    }

    const department = await updatedepartment(req.params.id, req.body);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "department not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "department updated successfully",
      department,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

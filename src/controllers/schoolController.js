import {
  createschool,
  allschools,
  deleteschool,
  getOneSchoolWithDetails,
  updateschool,
  checkExistingCollegeByid,
  checkExistingSchool,
} from "../services/schoolService";
import { checkprivileges } from "../helpers/privileges";

export const addschool = async (req, res) => {
  try {
    if (
      req.user.role !== "systemcampusadmin" && !checkprivileges(req.user.privileges, "manage-schools")
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
  
    req.body.name = req.body.name.toUpperCase();
    const college_ID = req.body.college_ID;

    if (!req.body.name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }
    if (!college_ID) {
      return res.status(400).json({
        success: false,
        message: "college_ID is required",
      });
    }

    const existingCollegex = await checkExistingCollegeByid(
      req.body.college_ID
    );
    if (!existingCollegex) {
      console.log("College not exists ");
      return res.status(400).json({
        success: false,
        message: "College not exists ",
      });
    }

    const existingSchool = await checkExistingSchool(
      req.body.name.toUpperCase(),
      college_ID
    );

    if (existingSchool) {
      console.log("school with the same name already exists on that college");
      return res.status(400).json({
        success: false,
        message: "school with the same name already exists on that college",
      });
    }

    const newschool = await createschool(req.body);

    return res.status(201).json({
      success: true,
      message: "school created successfully",
      school: newschool,
    });
  } catch (error) {
    console.error("Error adding school:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const getAllschools = async (req, res) => {
  try {
    const campusid = req.user.campus;
    let data = await allschools();
    data = data?.filter(school => school?.college?.Campus.id === campusid);

    if (!data) {
      data=[]
    }

    return res.status(200).json({
      success: true,
      message: "Schools retrieved successfully",
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

export const deleteOneschool = async (req, res) => {
  try {
    if (
      !checkprivileges(req.user.privileges, "manage-schools")
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    const school = await deleteschool(req.params.id);
    if (!school) {
      return res.status(404).json({
        success: false,
        message: "school not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "school deleted successfully",
      school,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const getOneschool = async (req, res) => {
  try {
    const { id } = req.params;
    let data = await getOneSchoolWithDetails(id);
    if (!data) {
      return res.status(404).json({
        message: "School not found",
      });
    }

     const campusid = req.user.campus;

     if (!Array.isArray(data)) {
      data = [data];
    }
    data = data?.filter(school => school?.college?.Campus.id === campusid);

    return res.status(200).json({
      success: true,
      message: "School retrieved successfully",
      data,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const updateOneschool = async (req, res) => {
  try {
    if (
      req.user.role !== "systemcampusadmin" && !checkprivileges(req.user.privileges, "manage-schools")
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
      

    req.body.name = req.body.name.toUpperCase();
    const college_ID = req.body.college_ID;
    if (!req.body.name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!college_ID) {
      return res.status(400).json({
        success: false,
        message: "college_ID is required",
      });
    }

    const existingCollegex = await checkExistingCollegeByid(
      req.body.college_ID
    );
    if (!existingCollegex) {
      return res.status(400).json({
        success: false,
        message: "College not exists ",
      });
    }

    // const existingSchool = await checkExistingSchool(
    //   req.body.name.toUpperCase(),
    //   college_ID
    // );

    // if (existingSchool) {
    //   console.log("school with the same name already exists on that college");
    //   return res.status(400).json({
    //     success: false,
    //     message: "school with the same name already exists on that college",
    //   });
    // }

    const school = await updateschool(req.params.id, req.body);
    if (!school) {
      return res.status(404).json({
        success: false,
        message: "school not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "school updated successfully",
      school,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

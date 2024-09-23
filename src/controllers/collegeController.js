import {
  createCollege,
  deleteCollege,
  updateCollege,
  colleges,
  getOneCollegeWithDetails,
  checkExistingCollege,
  checkExistingCampusByid,
} from "../services/collegeService";

export const CollegeWithAll = async (req, res) => {
  try {
    const campusid=req.user.campus;

    let data = await colleges();
    if (!data) {
      return res.status(404).json({
        message: "College not found",
      });
    }
    data= data.filter(college => college.campus_id===campusid)

    return res.status(200).json({
      success: true,
      message: "college retrieved successfully",
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

export const addCollege = async (req, res) => {
  try {
    if (req.user.role !== "systemcampusadmin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized, you are not systemcampusadmin",
      });
    }
    req.body.campus_id = req.user.campus;
    req.body.name = req.body.name.toUpperCase();
 
    if (!req.body.name || req.body.name === "") {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!req.body.abbreviation || req.body.abbreviation === "") {
      return res.status(400).json({
        success: false,
        message: "Abbreviation is required",
      });
    }

    const existingCollege = await checkExistingCollege(
      req.body.name,
      req.body.campus_id
    );

    if (existingCollege) {
      console.log("College with the same name already exists on that campus");
      return res.status(400).json({
        success: false,
        message: "College with the same name already exists on that campus",
      });
    }
    const newCollege = await createCollege(req.body);

    return res.status(201).json({
      success: true,
      message: "College created successfully",
      college: newCollege,
    });
  } catch (error) {
    console.error("Error adding college:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const deleteOneCollege = async (req, res) => {
  try {
    if (req.user.role !== "systemcampusadmin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized, you are not systemcampusadmin",
      });
    }
    const College = await deleteCollege(req.params.id);
    if (!College) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "College deleted successfully",
      College,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const getOneCollege = async (req, res) => {
  try {
    const campusid=req.user.campus;
    const { id } = req.params;
    let data = await getOneCollegeWithDetails(id);
    if (!data) {
      return res.status(404).json({
        message: "college not found",
      });
    }

    if (!Array.isArray(data)) {
      data = [data];
    }
    data= data.filter(college => college.campus_id===campusid)

    return res.status(200).json({
      success: true,
      message: "college retrieved successfully",
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

export const updateOneCollege = async (req, res) => {
  try {
    if (req.user.role !== "systemcampusadmin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized, you are not systemcampusadmin",
      });
    }
    // Extract name, id, and abbreviation from req.body
    req.body.name = req.body.name.toUpperCase();
    const campusID = req.body.campus_id;
    const abbreviation = req.body.abbreviation;

    // Check if name is not provided
    if (!req.body.name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }
    if (!campusID) {
      return res.status(400).json({
        success: false,
        message: "campus_id is required",
      });
    }

    // Check if campus_id exists
    const existingCampus = await checkExistingCampusByid(campusID);
    if (!existingCampus) {
      console.log("Campus not exists ");
      return res.status(400).json({
        success: false,
        message: "Campus not exists ",
      });
    }

    const existingCollege = await checkExistingCollege(req.body.name, campusID);

    if (existingCollege) {
      console.log("College with the same name already exists on that campus");
      return res.status(400).json({
        success: false,
        message: "College with the same name already exists on that campus",
      });
    }

    const updatedCollege = await updateCollege(req.params.id, req.body);

    if (!updatedCollege) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "College updated successfully",
      college: updatedCollege,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

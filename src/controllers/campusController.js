// campusController.js
import {
  campusWithAll,
  createCampus,
  getAllCampuses,
  deleteOneCampus,
  checkExistingCampus,
  getOneCampusWithDetails,
  updateOneCampus,
} from "../services/campusService";

export const campusWithAllController = async (req, res) => {
  try {
    // const campusid=req.user.campus;

    let data = await campusWithAll();
    if (!data) {
      return res.status(404).json({
        message: "Campus not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Campus retrieved successfully",
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

export const campusWithAllControllerForSTUDENT = async (req, res) => {
  try {
    // const campusid=req.user.campus;

    let data = await campusWithAll();
    if (!data) {
      return res.status(404).json({
        message: "Campus not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Campus retrieved successfully",
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

export const addCampusController = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized, you are not superadmin",
      });
    }

    req.body.name = req.body.name.toUpperCase();

    if (!req.body.name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const existingCampus = await checkExistingCampus(req.body.name);
    if (existingCampus) {
      console.log("Campus with the same name already exists ");
      return res.status(400).json({
        success: false,
        message: "Campus with the same name already exists ",
      });
    }

    const newCampus = await createCampus(req.body);
    return res.status(201).json({
      success: true,
      message: "Campus created successfully",
      campus: newCampus,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getAllCampusesController = async (req, res) => {
  try {
    let campuses = await getAllCampuses();
    if (!campuses) {
      return res.status(404).json({
        message: "Campus not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Campuses retrieved successfully",
      campuses,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const deleteOneCampusController = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized, you are not superadmin",
      });
    }

    const campus = await deleteOneCampus(req.params.id);
    if (!campus) {
      return res.status(404).json({
        success: false,
        message: "Campus not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Campus deleted successfully",
      campus,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const getOneCampusController = async (req, res) => {
  try {
    const { id } = req.params;
    let data = await getOneCampusWithDetails(id);
    if (!data) {
      return res.status(404).json({
        message: "Campus not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Campus retrieved successfully",
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

export const updateOneCampusController = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized, you are not superadmin",
      });
    }
    req.body.name = req.body.name.toUpperCase();
    if (req.body.name !== undefined) {
      const existingCampusByName = await checkExistingCampus(req.body.name);
      if (existingCampusByName && existingCampusByName.id !== req.params.id) {
        console.log("Campus with the new name already exists");
        return res.status(400).json({
          success: false,
          message: "Campus with the new name already exists",
        });
      }
    }
    const updatedCampus = await updateOneCampus(req.params.id, req.body);
    if (!updatedCampus) {
      return res.status(404).json({
        success: false,
        message: "Campus not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Campus updated successfully",
      campus: updatedCampus,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

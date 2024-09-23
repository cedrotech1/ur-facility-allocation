import {
  creategroup,
  getOneDepartmentWithDetails,
  deletegroup,
  allgroups,
  updategroup,
  checkExistinggroupByid,
  check,
  get_Group
} from "../services/groupService.js";
import { checkprivileges } from "../helpers/privileges";
import { getIntakeById, editIntake } from "../services/intakeService.js";

export const groupWithAll = async (req, res) => {
  try {
    const userCampusId = req.user.campus;
    let data = await allgroups();

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Groups not found",
      });
    }

   

    return res.status(200).json({
      success: true,
      message: "Groups retrieved successfully",
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



export const addgroup = async (req, res) => {
  try {
    if (!checkprivileges(req.user.privileges, "manage-intakes")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    req.body.name = req.body.name.toUpperCase();
    const intake_id = req.body.intake_id;
    const size = req.body.size;

    if (!req.body.name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }
    if (!size) {
      return res.status(400).json({
        success: false,
        message: "size is required",
      });
    }
    if (!intake_id) {
      return res.status(400).json({
        success: false,
        message: "intake_id is required",
      });
    }

    const existingIntake = await getIntakeById(intake_id);
    if (!existingIntake) {
      return res.status(400).json({
        success: false,
        message: "intake not exists ",
      });
    }

    const existingGroup = await check(req.body.name.toUpperCase(), intake_id);

    if (existingGroup) {
      console.log("group with the same name already exists in that intake");
      return res.status(400).json({
        success: false,
        message: "group with the same name already exists in that intake",
      });
    }

    // const existinggroup = await checkExistinggroupByid(intake_id);
    // if (!existinggroup) {
    //   console.log("group not exists ");
    //   return res.status(400).json({
    //     success: false,
    //     message: "group not exists ",
    //   });
    // }

    const newgroup = await creategroup(req.body);
    const newIntakeSize = parseInt(existingIntake.size) + parseInt(size);
    await editIntake(intake_id, { size: newIntakeSize });
    return res.status(201).json({
      success: true,
      message: "group created successfully",
      group: newgroup,
    });
  } catch (error) {
    console.log(error);
    console.error("Error adding group:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const deleteOnegroup = async (req, res) => {
  try {
    if (!checkprivileges(req.user.privileges, "manage-intakes")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    const existingGroup = await get_Group(req.params.id);
    if (!existingGroup) {
      return res.status(400).json({
        success: false,
        message: "group does not exist",
      });
    }
    const intake_id = existingGroup.intake_id;
    const size = existingGroup.size;
    const existingIntake = await getIntakeById(intake_id);
    const newIntakeSize = parseInt(existingIntake.size) - parseInt(size);

    await editIntake(intake_id, { size: newIntakeSize });
    const group = await deletegroup(req.params.id);

    return res.status(200).json({
      success: true,
      message: "group deleted successfully",
      group,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const getOnegroup = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getOneDepartmentWithDetails(id);
    if (!data) {
      return res.status(404).json({
        message: "group not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "group retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};
export const updateOnegroup = async (req, res) => {
  try {
    if (!checkprivileges(req.user.privileges, "manage-intakes")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    console.log(req.user.privileges);

    req.body.name = req.body.name.toUpperCase();
    const intake_id = req.body.intake_id;
    const size = req.body.size;

    if (!req.body.name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }
    if (!size) {
      return res.status(400).json({
        success: false,
        message: "size is required",
      });
    }
    if (!intake_id) {
      return res.status(400).json({
        success: false,
        message: "intake_id is required",
      });
    }

    const existinggroup1 = await check(req.body.name.toUpperCase(), intake_id);

    if (existinggroup1) {
      console.log("group with the same name already exists in that intake");
      return res.status(400).json({
        success: false,
        message: "group with the same name already exists in that intake",
      });
    }

    const existinggroup = await checkExistinggroupByid(intake_id);
    if (!existinggroup) {
      console.log("group not exists ");
      return res.status(400).json({
        success: false,
        message: "group not exists ",
      });
    }
    

    const group = await updategroup(req.params.id, req.body);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "group not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "group updated successfully",
      group,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

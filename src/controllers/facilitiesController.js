import {
  addFacility,
  getFacilities,
  getFacilityByCampusIdAndName,
  deleteFacility,
  getOneFacility,
  updateFacility,
  removeMaterialFromFacility,
  assignDefaultGroups,
  removeOneDefaultGroup,
  removeAllDefaultGroups,
  getFacilitiesHasDefaultGroups,
  getFacilitiesHasDefaultGroupsBySchool,
  getFacilitiesHasDefaultGroupsForStudent,
  isGroupAssignedToAnyFacility,
  getDisactivesFacilities,
  getactivesFacilities,
  assignDefaultGroupsNew,
} from "../services/facilityService.js";
import { deanschool } from '../services/schoolService.js';
import { get_Group } from "../services/groupService";
import { checkprivileges } from "../helpers/privileges.js";
import { Onecampus } from "../services/campusService.js";
import Email from "../utils/mailer";

import { getOneSchoolWithDetails } from "../services/schoolService";

export const createFacility = async (req, res) => {
  if (
    req.user.role === "user" &&
    !checkprivileges(req.user.privileges, "manage-facilities")
  ) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to create a facility",
    });
  }
  if (!req.body.name || req.body.name === "") {
    return res.status(400).json({
      success: false,
      message: "Name is required",
    });
  }
  if (!req.body.location || req.body.location === "") {
    return res.status(400).json({
      success: false,
      message: "Location is required",
    });
  }
  if (!req.body.size || req.body.size === "") {
    return res.status(400).json({
      success: false,
      message: "Size is required",
    });
  }
  if (!req.body.category || req.body.category === "") {
    return res.status(400).json({
      success: false,
      message: "Category is required",
    });
  }
  if (!req.body.materials || req.body.materials === "") {
    return res.status(400).json({
      success: false,
      message: "Materials is required",
    });
  }
  req.body.campus_id = req.user.campus;
  req.body.status = "active";

  try {
    const existingCampus = await Onecampus(req.body.campus_id);
    if (!existingCampus) {
      return res.status(400).json({
        success: false,
        message: "Campus does not exist",
      });
    }

    const existingFacility = await getFacilityByCampusIdAndName(
      req.body.campus_id,
      req.body.location,
      req.body.name
    );
    if (existingFacility) {
      return res.status(400).json({
        success: false,
        message: "Facility with the same name already exists",
      });
    }

    let managerId = null;
    let technicianId = null;
    if (
      req.body.category === "computerLab" ||
      req.body.category === "medicineLab"
    ) {
      managerId = req.body.managerId;
      technicianId = req.body.technicianId;
    }

    const newFacility = await addFacility({
      ...req.body,
      managerId,
      technicianId,
    });

    return res.status(201).json({
      success: true,
      message: "Facility created successfully",
      Facility: newFacility,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
export const getDisactivatesFacilities = async (req, res) => {
  try {
    const facilities = await getDisactivesFacilities(req.user.campus);
    return res.status(200).json({
      message: "Disactive Facilities retrieved successfully",
      facilities,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};
export const getActivatedFacilities = async (req, res) => {
  try {
    const facilities = await getactivesFacilities(req.user.campus);
    return res.status(200).json({
      message: "active Facilities retrieved successfully",
      facilities,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};
export const getAllFacilities = async (req, res) => {
  try {
    let facilities = await getFacilities(req.user.campus);

    if (!facilities || facilities.length === 0) {
      facilities=[]; 
    }
    
    // Initialize statistics with desired keys
    const statistics = {
      classRoom: 0,
      computerLab: 0,
      medicineLab: 0
    };

    facilities.forEach(facility => {
      // Normalize facility category to lowercase for comparison
      const category = facility.category.toLowerCase();

      // Map category to the appropriate statistic key
      if (category === "classroom") {
        statistics.classRoom++;
      } else if (category === "computerlab") {
        statistics.computerLab++;
      } else if (category === "medicinelab") {
        statistics.medicineLab++;
      }
    });

    return res.status(200).json({
      message: "Facilities retrieved successfully",
      facilities,  // Return facilities as they are, no changes to category casing
      statistics,  // Return consistently formatted statistics
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const deleteOneFacility = async (req, res) => {
  try {
    if (!checkprivileges(req.user.privileges, "manage-facilities")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    const existingFacility = await getOneFacility(req.params.id);
    if (!existingFacility) {
      return res.status(400).json({
        success: false,
        message: "Facility does not exist",
      });
    }
    if (existingFacility.campus_id !== req.user.campus) {
      return res.status(400).json({
        success: false,
        message: "Facility does not exist in your campus",
      });
    }
    const facalityToDelete = await deleteFacility(req.params.id);
    if (facalityToDelete) {
      return res.status(200).json({
        message: "Facility deleted successfully",
        facalityToDelete,
      });
    }
    return res.status(404).json({
      message: "Facility not found",
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};
export const getOneFacilityById = async (req, res) => {
  try {
    const facility = await getOneFacility(req.params.id);
    if (facility) {
      return res.status(200).json({
        message: "Facility retrieved successfully",
        facility,
      });
    }
    return res.status(404).json({
      message: "facility not found",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};
export const updateOneFacility = async (req, res) => {
  try {
    if (
      req.user.role === "user" &&
      !checkprivileges(req.user.privileges, "manage-facilities")
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    const existingFacility = await getOneFacility(req.params.id);
    if (!existingFacility) {
      return res.status(400).json({
        success: false,
        message: "Facility does not exist",
      });
    }
    if (existingFacility.campus_id !== req.user.campus) {
      return res.status(400).json({
        success: false,
        message: "Facility does not exist in your campus",
      });
    }
    if (req.body.size == "") {
      req.body.size = existingFacility.size;
    }
    if (req.body.managerId == "") {
      req.body.managerId = existingFacility.managerId;
    }
    if (req.body.technicianId == "") {
      req.body.technicianId = existingFacility.technicianId;
    }
    console.log(req.body);
    const facilityToUpdate = await updateFacility(req.params.id, req.body);
    if (facilityToUpdate) {
      return res.status(200).json({
        message: "Facility updated successfully",
        facility: facilityToUpdate,
      });
    }
    return res.status(404).json({
      message: "Facility not found",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};
export const addOneMaterial = async (req, res) => {
  try {
    if (!req.body.material || !req.body.material === "") {
      return res.status(400).json({
        message: "material is required",
      });
    }
    const facility = await addFacility(req.params.id, req.body.material);
    if (facility) {
      return res.status(200).json({
        message: "Facility added successfully",
        facility,
      });
    }
    return res.status(404).json({
      message: "Facility not found",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};
export const removeOneMaterial = async (req, res) => {
  try {
    if (
      req.user.role === "user" &&
      !checkprivileges(req.user.privileges, "manage-facilities")
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    const existingFacility = await getOneFacility(req.params.id);
    if (!existingFacility) {
      return res.status(400).json({
        success: false,
        message: "Facility does not exist",
      });
    }
    if (existingFacility.campus_id !== req.user.campus) {
      return res.status(400).json({
        success: false,
        message: "Facility does not exist in your campus",
      });
    }
    if (!req.body.material || !req.body.material) {
      return res.status(400).json({
        message: "material is required",
      });
    }
    const facility = await removeMaterialFromFacility(
      req.params.id,
      req.body.material
    );
    if (facility) {
      return res.status(200).json({
        message: "Material removed successfully",
        facility,
      });
    }
    return res.status(404).json({
      message: "Facility not found",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};
export const assignDefaultGroupsToFacility = async (req, res) => {
  try {
    if (
      req.user.role === "user" &&
      !checkprivileges(req.user.privileges, "manage-facilities") &&
      !checkprivileges(req.user.privileges, "manage-time-table")
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to assign default groups",
      });
    }

    const existingFacility = await getOneFacility(req.params.id);
    if (!existingFacility) {
      return res.status(400).json({
        success: false,
        message: "Facility does not exist",
      });
    }

    if (existingFacility.campus_id !== req.user.campus) {
      return res.status(400).json({
        success: false,
        message: "Facility does not exist in your campus",
      });
    }

    const { time, trimester, groups, sendEmail } = req.body;

    if (!time || !trimester || !groups || !Array.isArray(groups) || groups.length === 0) {
      return res.status(400).json({
        message: "time, trimester, and groups are required",
      });
    }

    const isValid = await Promise.all(
      groups.map(async (group) => {
        const groupDetails = await get_Group(group);
        return groupDetails.size <= existingFacility.size;
      })
    );

    if (!isValid.every(Boolean)) {
      return res.status(400).json({
        message: "One or more groups exceed the facility size",
      });
    }

    const result = await assignDefaultGroupsNew(req.params.id, { time, trimester, groups });

    if (result.success) {
      if (sendEmail) {
        await Promise.all(
          groups.map(async (group) => {
            const groupDetails = await get_Group(group);
            if (groupDetails?.cp != null) {
              existingFacility.group = groupDetails;
              await new Email(
                groupDetails.cp,
                null,
                null,
                null,
                existingFacility
              ).sendCPNotification();
            }
          })
        );
      }

      if (sendEmail) {
        const facility = await getOneFacility(req.params.id);
        const schoolId = facility.facilitydefaultGroups?.[0]?.groups?.[0]?.intake?.program?.department?.school?.id;

        if (schoolId) {
          const school = await getOneSchoolWithDetails(schoolId);
          if (school?.schooldean) {
            await new Email(
              school.schooldean,
              null,
              null,
              null,
              existingFacility
            ).sendAssignedDean();
          }
        }
      }

      return res.status(200).json({
        message: "Default groups added successfully",
        newDefaultGroup: result.defaultGroup,
      });
    } else {
      // If no new groups were assigned, return a 400 status code with the message
      return res.status(400).json({
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error assigning default groups:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const removeOneDefaultGroupFromFacility = async (req, res) => {
  try {
    if (
      req.user.role === "user" &&
      !checkprivileges(req.user.privileges, "manage-facilities") &&
      !checkprivileges(req.user.privileges, "manage-time-table")
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to remove default group",
      });
    }

    const existingFacility = await getOneFacility(req.params.id);
    if (!existingFacility) {
      return res.status(400).json({
        success: false,
        message: "Facility does not exist",
      });
    }

    if (existingFacility.campus_id !== req.user.campus) {
      return res.status(400).json({
        success: false,
        message: "Facility does not exist in your campus",
      });
    }

    const { groupId, defaultGroupId } = req.body;

    if (!groupId || !defaultGroupId) {
      return res.status(400).json({
        message: "Both group ID and defaultGroup ID are required",
      });
    }

    // Remove the group from the DefaultGroup model based on defaultGroupId and groupId
    const result = await removeOneDefaultGroup(req.params.id, groupId, defaultGroupId);
    
    if (result) {
      return res.status(200).json({
        message: "Default group removed successfully",
        result,
      });
    } else {
      return res.status(400).json({
        message: "Failed to remove default group",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
export const removeAllDefaultGroupsFromFacility = async (req, res) => {
  try {
    if (
      req.user.role === "user" &&
      !checkprivileges(req.user.privileges, "manage-facilities") &&
      !checkprivileges(req.user.privileges, "manage-time-table")
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to remove default groups",
      });
    }
    
    const existingFacility = await getOneFacility(req.params.id);
    if (!existingFacility) {
      return res.status(400).json({
        success: false,
        message: "Facility does not exist",
      });
    }

    if (existingFacility.campus_id !== req.user.campus) {
      return res.status(400).json({
        success: false,
        message: "Facility does not exist in your campus",
      });
    }

    // Call the function to remove all default groups
    await removeAllDefaultGroups(req.params.id);
    return res.status(200).json({
      message: "Default groups removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
export const getFacilitiesWithDefaultGroups = async (req, res) => {
  try {
    let facilities = await getFacilitiesHasDefaultGroups(req.user.campus);
    if (!facilities || facilities.length === 0) {
      facilities=[];
    }
    return res.status(200).json({
      message: "Facilities retrieved successfully",
      facilities,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
export const getFacilitiesWithDefaultGroupsForStudent = async (req, res) => {
  try {
    let facilities = await getFacilitiesHasDefaultGroupsForStudent();
    if (!facilities || facilities.length === 0) {
      facilities=[]
    }
    return res.status(200).json({
      message: "Facilities retrieved successfully",
      facilities,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};


export const getFacilitiesWithDefaultGroupsByDean = async (req, res) => {
  try {
    if (!checkprivileges(req.user.privileges, "school-dean")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, only school dean can access this route",
      });
    }
    const facilities = await getFacilitiesHasDefaultGroupsBySchool(req.user.campus, req.user.id);
    let  filteredFacilities;

    if (!facilities || facilities.length === 0) {
      return res.status(404).json({
        message: "No facilities found with default groups for the dean.",
      });
    }
    const school = await deanschool(req.user.id);

    if (!school) {
      filteredFacilities=[]
    }else{
     filteredFacilities = facilities.map((facility) => {
      const filteredDefaultGroups = facility.facilitydefaultGroups.filter((defaultGroup) =>
        defaultGroup.groups.some(group => 
          group.intake.program.department.school.id === school.id
        )
      );
      if (filteredDefaultGroups.length > 0) {
        return { ...facility, facilitydefaultGroups: filteredDefaultGroups };
      }
    }).filter(facility => facility); 
    }
    return res.status(200).json({
      message: "Facilities retrieved successfully",
      facilities: filteredFacilities,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

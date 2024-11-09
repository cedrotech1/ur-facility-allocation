import {
  addFacility,
  getFacilities,
  getFacilityByCampusIdAndName,
  deleteFacility,
  getOneFacility,
  updateFacility,
  removeMaterialFromFacility,
  removeOneDefaultGroup,
  removeAllDefaultGroups,
  getFacilitiesHasDefaultGroups,
  getFacilitiesHasDefaultGroupsBySchool,
  getFacilitiesHasDefaultGroupsForStudent,
  getDisactivesFacilities,
  getactivesFacilities,
  assignDefaultGroupsWithTimes,
  updateDefaultGroup,
  addTimeToDefaultGroup,
  deleteTimeById,
  getOneDefaultGroup,
  getDefaultGroupsWithTimes,
  activateDefaultGroup,
  deactivateDefaultGroup,
  saveFacilitiesData,
  

} from "../services/facilityService.js";


import { deanschool } from '../services/schoolService.js';
import { get_Group } from "../services/groupService";
import { checkprivileges } from "../helpers/privileges.js";
import { Onecampus } from "../services/campusService.js";
import Email from "../utils/mailer";
import { getOneSchoolWithDetails } from "../services/schoolService";
import fs from "fs";
const path = require('path');
const xlsx = require('xlsx');


export const processFacilities = async (req, res) => {
  if (!req.file) {
      return res.status(400).send('No file uploaded.');
  }

  const fileExtension = path.extname(req.file.originalname);
  // Allow only Excel files: .xlsx or .xls
  if (fileExtension !== '.xlsx' && fileExtension !== '.xls') {
      return res.status(400).send('Invalid file format. Please upload an Excel file.');
  }

  const results = [];
  const excelFilePath = req.file.path;

  try {
      const workbook = xlsx.readFile(excelFilePath);
      const sheetName = workbook.SheetNames[0]; 
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet to JSON
      const data = xlsx.utils.sheet_to_json(sheet);

      data.forEach((row) => {
          const materialsArray = row.materials ? row.materials.split(',').map(material => material.trim()) : [];

          const facilityData = {
              campus_id: req.user.campus, 
              name: row.name,
              location: row.location,
              size: parseInt(row.size, 10), 
              category: row.category,
              status: 'active', 
              materials: materialsArray 
          };

          results.push(facilityData); 
      });

      fs.unlinkSync(excelFilePath);
      const { createdFacilities, duplicateFacilities } = await saveFacilitiesData(results);

      // Respond to the client with results
      return res.json({
          message: 'Facilities processed successfully.',
          createdFacilities,
          duplicateFacilities: duplicateFacilities.length > 0 
              ? `Duplicate facilities skipped: ${duplicateFacilities.join(', ')}`
              : 'No duplicates found'
      });

  } catch (error) {
      console.error('Error processing the Excel file:', error.message);
      return res.status(500).send('Error processing the Excel file: ' + error.message);
  }
};




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

export const fetchDefaultGroupsWithTimes = async (req, res) => {
  try {
    const TimeTable = await getDefaultGroupsWithTimes();
    const userCampusId = req.user.campus;
    const filteredTimeTable = TimeTable.filter(item => item.defaultgroupTime.facility.campus_id === userCampusId);

    if (filteredTimeTable.length > 0) {
      return res.status(200).json({
        message: "Facility retrieved successfully",
        TimeTable: filteredTimeTable,
      });
    }
  
    return res.status(404).json({
      message: "No facilities found for the user's campus",
      TimeTable: [],
    });
  } catch (error) {
    console.log(error);
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

    const { module, lecturer, trimester, groups, times } = req.body;

    if (!module || !lecturer || !trimester || !groups || !times || !Array.isArray(times) || times.length === 0) {
      return res.status(400).json({
        message: "module, lecturer, trimester, groups, and times are required",
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


    const result = await assignDefaultGroupsWithTimes(req.params.id, {
      module, lecturer, trimester, groups, times,
    });

    if (result.success) {
      return res.status(200).json({
        message: result.message,
        newDefaultGroup: result.defaultGroup,
      });
    } else {
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
export const updateDefaultGroups = async (req, res) => {
  try {
    if (
      req.user.role === "user" &&
      !checkprivileges(req.user.privileges, "manage-facilities") &&
      !checkprivileges(req.user.privileges, "manage-time-table")
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update default groups",
      });
    }

    const { groups } = req.body;

    if (!groups || !Array.isArray(groups)) {
      return res.status(400).json({
        message: "Groups are required and must be an array",
      });
    }
    const defaultGroup = await getOneDefaultGroup(req.params.id);

    if (!defaultGroup) {
      return res.status(404).json({
        message: "Default group not found",
      });
    }
    const facilityId = defaultGroup.facilityId;
    const facility = await getOneFacility(facilityId);

    if (!facility) {
      return res.status(404).json({
        message: "Facility not found",
      });
    }

    const facilitySize = facility.size;
    const existingDefaultGroups = facility.facilitydefaultGroups || [];
    const existingGroupsTotalSize = existingDefaultGroups.reduce((total, defaultGroup) => {
      const groupSizes = defaultGroup.groups.reduce((sum, group) => sum + group.size, 0);
      return total + groupSizes;
    }, 0);


    const newGroupsTotalSize = await Promise.all(
      groups.map(async (groupId) => {
        const groupDetails = await get_Group(groupId); 
        return groupDetails.size;
      })
    ).then(sizes => sizes.reduce((sum, size) => sum + size, 0));

    const totalSizeAfterAdding = existingGroupsTotalSize + newGroupsTotalSize;

    
    if (totalSizeAfterAdding > facilitySize) {
      return res.status(400).json({
        message: `Facility size exceeded. Capacity: ${facilitySize}, Current: ${existingGroupsTotalSize}, Adding: ${newGroupsTotalSize}`,

      });
    }

    const result = await updateDefaultGroup(req.params.id, groups);

    if (result.success) {
      return res.status(200).json({
        message: result.message,
        updatedDefaultGroup: result.updatedDefaultGroup,
      });
    } else {
      return res.status(400).json({
        message: result.message,
      });
    }

  } catch (error) {
    console.error("Error updating default groups:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
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

    // if (existingFacility.campus_id !== req.user.campus) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Facility does not exist in your campus",
    //   });
    // }

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

    // if (existingFacility.campus_id !== req.user.campus) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Facility does not exist in your campus",
    //   });
    // }

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
      success: true,
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
        facilities:[]
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

export const addTimeController = async (req, res) => {
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
    const { day, timeInterval } = req.body; 
    const defaultGroupId = req.params.id; 

    if (!day || !timeInterval || !defaultGroupId) {
      return res.status(400).json({
        success: false,
        message: "Day, timeInterval, and defaultGroupId are required.",
      });
    }

    const result = await addTimeToDefaultGroup(day, timeInterval, defaultGroupId);

    if (result.success) {
      return res.status(201).json({
        message: result.message,
        newTime: result.newTime,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error adding time:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const deleteTimeController = async (req, res) => {
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
    const timeId = req.params.id;

    if (!timeId) {
      return res.status(400).json({
        success: false,
        message: "Time ID is required",
      });
    }

    const result = await deleteTimeById(timeId);

    if (result.success) {
      return res.status(200).json({
        message: result.message,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }

  } catch (error) {
    console.error("Error deleting time entry:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const activate = async (req, res) => {
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
    const { id } = req.params;
    const defaultGroup = await activateDefaultGroup(id);
    return res.status(200).json({
      message: 'DefaultGroup activated successfully',
      defaultGroup,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const deactivate = async (req, res) => {
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
    const { id } = req.params;
    const defaultGroup = await deactivateDefaultGroup(id);
    return res.status(200).json({
      message: 'DefaultGroup deactivated successfully',
      defaultGroup,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
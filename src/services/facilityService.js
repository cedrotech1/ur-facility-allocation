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

import Sequelize, { Op } from "sequelize";

export const checkExistingFacility = async (id) => {
  return await FacilitiesModel.findOne({
    where: {
      id: id,
    },
  });
};


export const addFacility = async (facilityData) => {
  try {
    const newFacility = await FacilitiesModel.create(facilityData);
    return newFacility;
  } catch (error) {
    throw new Error(`Error creating facility: ${error.message}`);
  }
};
export const getDisactivesFacilities = async (campus) => {
  try {
    const facilities = await FacilitiesModel.findAll({
      where: { campus_id: campus,status:'inactive'},
      include: [
        {
          model: Users,
          as: "manager",
          attributes: ["id", "firstname", "lastname", "email", "phone"],
          required: false,
        },
        {
          model: Users,
          as: "technician",
          attributes: ["id", "firstname", "lastname", "email", "phone"],
          required: false,
        },
      ],
    });
    if (!facilities || facilities.length === 0) {
      return null;
    }
    const groupsWithObjects = await Promise.all(
      facilities.map(async (facility) => {
        const groupNames = await GroupModel.findAll({
          attributes: ["id", "name", "size"],
          where: { id: facility.defaultGroups },
          include: [
            {
              model: IntakeModel,
              include: [
                {
                  model: ProgramModel,
                  attributes: ["id", "name"],
                  include: [
                    {
                      model: DepartmentModel,
                      attributes: ["id", "name"],
                      include: [
                        {
                          model: SchoolModel,
                          attributes: ["id", "name"],
                          include: [
                            {
                              model: CollegeModel,
                              attributes: ["id", "name", "abbreviation"],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        });

        return groupNames.map((group) => ({
          id: group.id,
          name: group.name,
          size: group.size,
          intake: group.Intake
            ? {
                id: group.Intake.id,
                name: group.Intake.displayName,
                program: group.Intake.program
                  ? {
                      id: group.Intake.program.id,
                      name: group.Intake.program.name,
                      department: group.Intake.program.department
                        ? {
                            id: group.Intake.program.department.id,
                            name: group.Intake.program.department.name,
                            school: group.Intake.program.department.School
                              ? {
                                  id: group.Intake.program.department.School.id,
                                  name: group.Intake.program.department.School
                                    .name,
                                  college: group.Intake.program.department
                                    .School.college
                                    ? {
                                        id: group.Intake.program.department
                                          .School.college.id,
                                        name: group.Intake.program.department
                                          .School.college.name,
                                        abbreviation:
                                          group.Intake.program.department.School
                                            .college.abbreviation,
                                      }
                                    : null,
                                }
                              : null,
                          }
                        : null,
                    }
                  : null,
              }
            : null,
        }));
      })
    );

    const facilitiesWithGroupObjects = facilities.map((facility, index) => ({
      ...facility.toJSON(),
      defaultGroups: groupsWithObjects[index],
    }));

    return facilitiesWithGroupObjects;
  } catch (error) {
    throw new Error(`Error getting facilities: ${error.message}`);
  }
};

export const getactivesFacilities = async (campus) => {
  try {
    const facilities = await FacilitiesModel.findAll({
      where: { campus_id: campus,status:'active'},
      include: [
        {
          model: Users,
          as: "manager",
          attributes: ["id", "firstname", "lastname", "email", "phone"],
          required: false,
        },
        {
          model: Users,
          as: "technician",
          attributes: ["id", "firstname", "lastname", "email", "phone"],
          required: false,
        },
      ],
    });
    if (!facilities || facilities.length === 0) {
      return null;
    }
    const groupsWithObjects = await Promise.all(
      facilities.map(async (facility) => {
        const groupNames = await GroupModel.findAll({
          attributes: ["id", "name", "size"],
          where: { id: facility.defaultGroups },
          include: [
            {
              model: IntakeModel,
              include: [
                {
                  model: ProgramModel,
                  attributes: ["id", "name"],
                  include: [
                    {
                      model: DepartmentModel,
                      attributes: ["id", "name"],
                      include: [
                        {
                          model: SchoolModel,
                          attributes: ["id", "name"],
                          include: [
                            {
                              model: CollegeModel,
                              attributes: ["id", "name", "abbreviation"],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        });

        return groupNames.map((group) => ({
          id: group.id,
          name: group.name,
          size: group.size,
          intake: group.Intake
            ? {
                id: group.Intake.id,
                name: group.Intake.displayName,
                program: group.Intake.program
                  ? {
                      id: group.Intake.program.id,
                      name: group.Intake.program.name,
                      department: group.Intake.program.department
                        ? {
                            id: group.Intake.program.department.id,
                            name: group.Intake.program.department.name,
                            school: group.Intake.program.department.School
                              ? {
                                  id: group.Intake.program.department.School.id,
                                  name: group.Intake.program.department.School
                                    .name,
                                  college: group.Intake.program.department
                                    .School.college
                                    ? {
                                        id: group.Intake.program.department
                                          .School.college.id,
                                        name: group.Intake.program.department
                                          .School.college.name,
                                        abbreviation:
                                          group.Intake.program.department.School
                                            .college.abbreviation,
                                      }
                                    : null,
                                }
                              : null,
                          }
                        : null,
                    }
                  : null,
              }
            : null,
        }));
      })
    );

    const facilitiesWithGroupObjects = facilities.map((facility, index) => ({
      ...facility.toJSON(),
      defaultGroups: groupsWithObjects[index],
    }));

    return facilitiesWithGroupObjects;
  } catch (error) {
    throw new Error(`Error getting facilities: ${error.message}`);
  }
};


// getactivesFacilities

export const getFacilities = async (campus) => {
  try {
    const facilities = await FacilitiesModel.findAll({
      where: { campus_id: campus },
      include: [
        {
          model: Users,
          as: "manager",
          attributes: ["id", "firstname", "lastname", "email", "phone"],
          required: false,
        },
        {
          model: Users,
          as: "technician",
          attributes: ["id", "firstname", "lastname", "email", "phone"],
          required: false,
        },
      ],
    });
    if (!facilities || facilities.length === 0) {
      return null;
    }
    const groupsWithObjects = await Promise.all(
      facilities.map(async (facility) => {
        const groupNames = await GroupModel.findAll({
          attributes: ["id", "name", "size"],
          where: { id: facility.defaultGroups },
          include: [
            {
              model: IntakeModel,
              include: [
                {
                  model: ProgramModel,
                  attributes: ["id", "name"],
                  include: [
                    {
                      model: DepartmentModel,
                      attributes: ["id", "name"],
                      include: [
                        {
                          model: SchoolModel,
                          attributes: ["id", "name"],
                          include: [
                            {
                              model: CollegeModel,
                              attributes: ["id", "name", "abbreviation"],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        });

        return groupNames.map((group) => ({
          id: group.id,
          name: group.name,
          size: group.size,
          intake: group.Intake
            ? {
                id: group.Intake.id,
                name: group.Intake.displayName,
                program: group.Intake.program
                  ? {
                      id: group.Intake.program.id,
                      name: group.Intake.program.name,
                      department: group.Intake.program.department
                        ? {
                            id: group.Intake.program.department.id,
                            name: group.Intake.program.department.name,
                            school: group.Intake.program.department.School
                              ? {
                                  id: group.Intake.program.department.School.id,
                                  name: group.Intake.program.department.School
                                    .name,
                                  college: group.Intake.program.department
                                    .School.college
                                    ? {
                                        id: group.Intake.program.department
                                          .School.college.id,
                                        name: group.Intake.program.department
                                          .School.college.name,
                                        abbreviation:
                                          group.Intake.program.department.School
                                            .college.abbreviation,
                                      }
                                    : null,
                                }
                              : null,
                          }
                        : null,
                    }
                  : null,
              }
            : null,
        }));
      })
    );

    const facilitiesWithGroupObjects = facilities.map((facility, index) => ({
      ...facility.toJSON(),
      defaultGroups: groupsWithObjects[index],
    }));

    return facilitiesWithGroupObjects;
  } catch (error) {
    throw new Error(`Error getting facilities: ${error.message}`);
  }
};

export const getFacilitiesWithCampus = async () => {
  return await FacilitiesModel.findAll({
    include: [
      {
        model: Campus,
        attributes: ["campus_id", "name"], // Include only the necessary attributes of the Campus model
        as: "campus", // Alias for the included Campus model
      },
    ],
  });
};

export const getFacilityByCampusIdAndName = async (
  campus_id,
  location,
  name
) => {
  return await FacilitiesModel.findOne({
    where: {
      campus_id,
      name,
      location,
    },
  });
};

export const deleteFacility = async (id) => {
  const FacilityToDelete = await FacilitiesModel.findOne({ where: { id } });
  if (FacilityToDelete) {
    await FacilitiesModel.destroy({ where: { id } });
    return FacilityToDelete;
  }
  return null;
};

export const getOneFacility = async (id) => {
  try {
    const facility = await FacilitiesModel.findOne({
      where: { id },
      include: [
        {
          model: Users,
          as: 'manager',
          attributes: ['id', 'firstname', 'lastname', 'email', 'phone'],
          required: false,
        },
        {
          model: Users,
          as: 'technician',
          attributes: ['id', 'firstname', 'lastname', 'email', 'phone'],
          required: false,
        },
        {
          model: DefaultGroupModel,
          as: 'facilitydefaultGroups',
          attributes: ['id', 'time', 'trimester', 'groups'],
          required: false,
        },
      ],
    });

    if (!facility) {
      return null;
    }

    const defaultGroupsWithDetails = await Promise.all(
      facility.facilitydefaultGroups.map(async (defaultGroup) => {
        if (!defaultGroup.groups || defaultGroup.groups.length === 0) {
          return defaultGroup;
        }

        const groupsWithObjects = await Promise.all(
          defaultGroup.groups.map(async (groupId) => {
            const group = await GroupModel.findOne({
              attributes: ['id', 'name', 'size'],
              where: { id: groupId },
              include: [
                {
                  model: IntakeModel,
                  include: [
                    {
                      model: ProgramModel,
                      attributes: ['id', 'name'],
                      include: [
                        {
                          model: DepartmentModel,
                          attributes: ['id', 'name'],
                          include: [
                            {
                              model: SchoolModel,
                              attributes: ['id', 'name'],
                              include: [
                                {
                                  model: CollegeModel,
                                  attributes: ['id', 'name', 'abbreviation'],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            });

            return {
              id: group.id,
              name: group.name,
              size: group.size,
              intake: group.Intake
                ? {
                    id: group.Intake.id,
                    name: group.Intake.displayName,
                    program: group.Intake.program
                      ? {
                          id: group.Intake.program.id,
                          name: group.Intake.program.name,
                          department: group.Intake.program.department
                            ? {
                                id: group.Intake.program.department.id,
                                name: group.Intake.program.department.name,
                                school: group.Intake.program.department.School
                                  ? {
                                      id: group.Intake.program.department.School.id,
                                      name: group.Intake.program.department.School.name,
                                      college: group.Intake.program.department.School.college
                                        ? {
                                            id: group.Intake.program.department.School.college.id,
                                            name: group.Intake.program.department.School.college.name,
                                            abbreviation: group.Intake.program.department.School.college.abbreviation,
                                          }
                                        : null,
                                    }
                                  : null,
                              }
                            : null,
                      }
                    : null,
                  }
                : null,
            };
          })
        );

        return {
          ...defaultGroup.toJSON(),
          groups: groupsWithObjects,
        };
      })
    );

    return {
      ...facility.toJSON(),
      facilitydefaultGroups: defaultGroupsWithDetails,
    };
  } catch (error) {
    throw new Error(`Error getting facility: ${error.message}`);
  }
};

export const updateFacility = async (id, facility) => {
  const FacilityToUpdate = await FacilitiesModel.findOne({ where: { id } });
  if (FacilityToUpdate) {
    await FacilitiesModel.update(facility, { where: { id } });
    return facility;
  }
  return null;
};

export const addMaterialToFacility = async (id, material) => {
  const facilityToUpdate = await FacilitiesModel.findOne({ where: { id } });
  if (facilityToUpdate) {
    const facilities = facilityToUpdate.facilities;
    facilities.push(material);
    await FacilitiesModel.update({ facilities }, { where: { id } });
    return facility;
  }
  return null;
};

export const removeMaterialFromFacility = async (id, material) => {
  const facilityToUpdate = await FacilitiesModel.findOne({ where: { id } });
  if (facilityToUpdate) {
    const facilities = facilityToUpdate.facilities;
    const index = facilities.indexOf(material);
    if (index > -1) {
      facilities.splice(index, 1);
    }
    await FacilitiesModel.update({ facilities }, { where: { id } });
    return material;
  }
  return null;
};

export const assignDefaultGroups = async (id, groups) => {
  try {
    const facilityToUpdate = await FacilitiesModel.findOne({ where: { id } });
    if (facilityToUpdate) {
      const defaultAssignment = await FacilitiesModel.update(
        { defaultGroups: groups },
        { where: { id } }
      );
      return defaultAssignment;
    }
    return null;
  } catch (error) {
    console.log(error);
    throw new Error(`Error updating default groups: ${error.message}`);
  }
};



export const assignDefaultGroupsNew = async (facilityId, { time, trimester, groups }) => {
  try {
    // Fetch or create a single entry for the given facilityId, time, and trimester
    let defaultGroup = await DefaultGroupModel.findOne({
      where: { facilityId, time, trimester }
    });

    if (defaultGroup) {
      // If the entry already exists, merge the new groups with the existing groups
      const existingGroups = defaultGroup.groups || [];
      const updatedGroups = [...new Set([...existingGroups, ...groups])]; // Use Set to avoid duplicates

      await DefaultGroupModel.update(
        { groups: updatedGroups },
        { where: { id: defaultGroup.id } }
      );
    } else {
      // If the entry doesn't exist, create a new one with the groups array
      defaultGroup = await DefaultGroupModel.create({
        facilityId,
        time,
        trimester,
        groups
      });
    }

    return defaultGroup;
  } catch (error) {
    throw new Error(`Error assigning default groups: ${error.message}`);
  }
};


export const removeOneDefaultGroup = async (facilityId, groupId, defaultGroupId) => {
  try {
    // Find the specific DefaultGroup entry by id
    const defaultGroup = await DefaultGroupModel.findOne({
      where: { id: defaultGroupId, facilityId },
    });

    if (!defaultGroup) {
      throw new Error("Default group not found");
    }

    // Log the groups before modification for debugging
    console.log("Original groups:", JSON.stringify(defaultGroup.groups));

    // Parse the JSON 'groups' array
    const groupsArray = typeof defaultGroup.groups === 'string'
      ? JSON.parse(defaultGroup.groups)
      : defaultGroup.groups;

    // Filter out the groupId to be removed
    const updatedGroups = groupsArray.filter((group) => group.toString() !== groupId.toString());

    console.log("Updated groups after filtering:", updatedGroups);

    if (updatedGroups.length === 0) {
      // If no groups are left, delete the DefaultGroup entry
      await DefaultGroupModel.destroy({ where: { id: defaultGroup.id } });
      console.log("DefaultGroup deleted as no groups remain.");
    } else {
      // Update the 'groups' array with the remaining groups
      const updateResult = await DefaultGroupModel.update(
        { groups: updatedGroups }, // Ensure it's stored as JSON
        { where: { id: defaultGroup.id } }
      );

      console.log("Update result:", updateResult);
      if (updateResult[0] === 0) {
        throw new Error("Failed to update the default groups.");
      }
    }

    return true; // Success
  } catch (error) {
    throw new Error(`Error removing one default group: ${error.message}`);
  }
};


export const removeAllDefaultGroups = async (facilityId) => {
  try {
    // Destroy all DefaultGroup entries for the given facility ID
    const result = await DefaultGroupModel.destroy({
      where: { facilityId },
    });

    if (result === 0) {
      throw new Error("No default groups found for the specified facility.");
    }

    return result; // Return the number of deleted records
  } catch (error) {
    throw new Error(`Error removing all default groups: ${error.message}`);
  }
};


export const getFacilitiesHasDefaultGroups = async (campus) => {
  try {
    const facilities = await FacilitiesModel.findAll({
      where: { campus_id: campus },
      include: [
        {
          model: Users,
          as: 'manager',
          attributes: ['id', 'firstname', 'lastname', 'email', 'phone'],
          required: false,
        },
        {
          model: Users,
          as: 'technician',
          attributes: ['id', 'firstname', 'lastname', 'email', 'phone'],
          required: false,
        },
        {
          model: DefaultGroupModel,
          as: 'facilitydefaultGroups',
          attributes: ['id', 'time', 'trimester', 'groups'],
          required: false,
        },
      ],
    });

    if (!facilities || facilities.length === 0) {
      return null;
    }

    const facilitiesWithDefaultGroups = await Promise.all(
      facilities.map(async (facility) => {
        const facilityDefaultGroups = facility.facilitydefaultGroups || [];

        // Check if there are any default groups
        if (facilityDefaultGroups.length === 0) {
          return null; // Ignore facilities without default groups
        }

        const groupsWithObjects = await Promise.all(
          facilityDefaultGroups.map(async (defaultGroup) => {
            if (!defaultGroup.groups || defaultGroup.groups.length === 0) {
              return defaultGroup; // Return the default group even if it has no groups
            }

            const groupsWithObjects = await Promise.all(
              defaultGroup.groups.map(async (groupId) => {
                const group = await GroupModel.findOne({
                  attributes: ['id', 'name', 'size'],
                  where: { id: groupId },
                  include: [
                    {
                      model: IntakeModel,
                      include: [
                        {
                          model: ProgramModel,
                          attributes: ['id', 'name'],
                          include: [
                            {
                              model: DepartmentModel,
                              attributes: ['id', 'name'],
                              include: [
                                {
                                  model: SchoolModel,
                                  attributes: ['id', 'name'],
                                  include: [
                                    {
                                      model: CollegeModel,
                                      attributes: ['id', 'name', 'abbreviation'],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                });

                return {
                  id: group.id,
                  name: group.name,
                  size: group.size,
                  intake: group.Intake
                    ? {
                        id: group.Intake.id,
                        name: group.Intake.displayName,
                        program: group.Intake.program
                          ? {
                              id: group.Intake.program.id,
                              name: group.Intake.program.name,
                              department: group.Intake.program.department
                                ? {
                                    id: group.Intake.program.department.id,
                                    name: group.Intake.program.department.name,
                                    school: group.Intake.program.department.School
                                      ? {
                                          id: group.Intake.program.department.School.id,
                                          name: group.Intake.program.department.School.name,
                                          college: group.Intake.program.department.School.college
                                            ? {
                                                id: group.Intake.program.department.School.college.id,
                                                name: group.Intake.program.department.School.college.name,
                                                abbreviation: group.Intake.program.department.School.college.abbreviation,
                                              }
                                            : null,
                                        }
                                      : null,
                                  }
                                : null,
                            }
                          : null,
                    }
                  : null,
                };
              })
            );

            return {
              ...defaultGroup.toJSON(),
              groups: groupsWithObjects,
            };
          })
        );

        return {
          ...facility.toJSON(),
          facilitydefaultGroups: groupsWithObjects,
        };
      })
    );

    // Filter out any null results (facilities without default groups)
    return facilitiesWithDefaultGroups.filter(facility => facility !== null);
  } catch (error) {
    throw new Error(`Error getting facilities: ${error.message}`);
  }
};







export const isGroupAssignedToAnyFacility = async (user, groupId) => {
  try {
    const campusId = user.campus;
    const conflictingFacilities = await FacilitiesModel.findAll({
      where: {
        campus_id: campusId,
      },
    });

    if (!conflictingFacilities || conflictingFacilities.length === 0) {
      return false;
    }

    const hasGroupAssigned = conflictingFacilities.some((facility) => {
      const defaultGroups = facility.defaultGroups;
      return defaultGroups && defaultGroups.includes(groupId);
    });

    return hasGroupAssigned;
  } catch (error) {
    console.error(`Error checking group assignment:`, error);
    throw new Error(`Error checking group assignment: ${error.message}`);
  }
};



export const getFacilitiesHasDefaultGroupsBySchool = async (campus, userId) => {
  try {
    const facilities = await FacilitiesModel.findAll({
      where: { campus_id: campus },
      include: [
        {
          model: Users,
          as: 'manager',
          attributes: ['id', 'firstname', 'lastname', 'email', 'phone'],
          required: false,
        },
        {
          model: Users,
          as: 'technician',
          attributes: ['id', 'firstname', 'lastname', 'email', 'phone'],
          required: false,
        },
        {
          model: DefaultGroupModel,
          as: 'facilitydefaultGroups',
          attributes: ['id', 'time', 'trimester', 'groups'],
          required: false,
        },
      ],
    });

    if (!facilities || facilities.length === 0) {
      return null;
    }

    const facilitiesWithDefaultGroups = await Promise.all(
      facilities.map(async (facility) => {
        const facilityDefaultGroups = facility.facilitydefaultGroups || [];

        // Check if there are any default groups
        if (facilityDefaultGroups.length === 0) {
          return null; // Ignore facilities without default groups
        }

        const groupsWithObjects = await Promise.all(
          facilityDefaultGroups.map(async (defaultGroup) => {
            if (!defaultGroup.groups || defaultGroup.groups.length === 0) {
              return defaultGroup; // Return the default group even if it has no groups
            }

            const groupsWithObjects = await Promise.all(
              defaultGroup.groups.map(async (groupId) => {
                const group = await GroupModel.findOne({
                  attributes: ['id', 'name', 'size'],
                  where: { id: groupId },
                  include: [
                    {
                      model: IntakeModel,
                      include: [
                        {
                          model: ProgramModel,
                          attributes: ['id', 'name'],
                          include: [
                            {
                              model: DepartmentModel,
                              attributes: ['id', 'name'],
                              include: [
                                {
                                  model: SchoolModel,
                                  attributes: ['id', 'name'],
                                  include: [
                                    {
                                      model: CollegeModel,
                                      attributes: ['id', 'name', 'abbreviation'],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                });

                return {
                  id: group.id,
                  name: group.name,
                  size: group.size,
                  intake: group.Intake
                    ? {
                        id: group.Intake.id,
                        name: group.Intake.displayName,
                        program: group.Intake.program
                          ? {
                              id: group.Intake.program.id,
                              name: group.Intake.program.name,
                              department: group.Intake.program.department
                                ? {
                                    id: group.Intake.program.department.id,
                                    name: group.Intake.program.department.name,
                                    school: group.Intake.program.department.School
                                      ? {
                                          id: group.Intake.program.department.School.id,
                                          name: group.Intake.program.department.School.name,
                                          college: group.Intake.program.department.School.college
                                            ? {
                                                id: group.Intake.program.department.School.college.id,
                                                name: group.Intake.program.department.School.college.name,
                                                abbreviation: group.Intake.program.department.School.college.abbreviation,
                                              }
                                            : null,
                                        }
                                      : null,
                                  }
                                : null,
                            }
                          : null,
                    }
                  : null,
                };
              })
            );

            return {
              ...defaultGroup.toJSON(),
              groups: groupsWithObjects,
            };
          })
        );

        return {
          ...facility.toJSON(),
          facilitydefaultGroups: groupsWithObjects,
        };
      })
    );

    // Filter out any null results (facilities without default groups)
    return facilitiesWithDefaultGroups.filter(facility => facility !== null);
  } catch (error) {
    throw new Error(`Error getting facilities: ${error.message}`);
  }
};
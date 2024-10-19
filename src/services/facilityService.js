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
import sequelize, { Op } from "sequelize";

export const getOneDefaultGroup = async (id) => {
  try {
    const defaultGroup = await DefaultGroupModel.findOne({
      where: { id },  
    });

    return defaultGroup;
  } catch (error) {
    console.error('Error fetching DefaultGroup:', error);
    throw new Error('Unable to retrieve DefaultGroup');
  }
};


// export const assignDefaultGroupsWithTimes = async (facilityId, { module, lecturer, trimester, groups, times }) => {
//   try {
    
//     // Ensure groups is an array of integers
//     if (!Array.isArray(groups) || groups.some(group => typeof group !== 'number')) {
//       throw new Error("Groups must be an array of valid integers");
//     }

//       for (const time of times) {
//         let status="active";
//         const conflictingTimes = await TimeModel.findAll({
//           where: {
//             day: time.day,  // Same day
//             timeInterval: time.timeInterval,  // Same time interval
//           },
//           include: [{
//             model: DefaultGroupModel,
//             as: 'defaultgroupTime',  // Alias defined in the association
//             where: {
//               facilityId: {
//                 [sequelize.Op.ne]: facilityId,  // Check for different facilities
//               },
//               status
//             },
//           }],
//         });

//         for (const conflictingTime of conflictingTimes) {
//           const conflictingGroups = conflictingTime.defaultgroupTime.groups; // Get the assigned groups
      
//           for (const group of groups) {
//             if (conflictingGroups.includes(group)) {
//               return {
//                 success: false,
//                 message: `Conflict: Group ${group} is already assigned to another facility at ${time.timeInterval} on ${time.day}.`,
//               };
//             }
//           }
//         }
//       }
      
      
      

//     // Check if any of the times conflict with existing records
//     for (const time of times) {
//       const conflictingTime = await TimeModel.findOne({
//         where: {
//           facility: facilityId,  // Check for the same facility
//           day: time.day,  // Check for the same day
//           timeInterval: time.timeInterval,  
//         }
//       });

//       if (conflictingTime) {
//         return {
//           success: false,
//           message: `Conflict: The ${time.timeInterval} on ${time.day} is already assigned to another group.`,
//         };
//       }
//     }

//     // Create DefaultGroup record
//     const status="active";
//     const defaultGroup = await DefaultGroupModel.create({
//       facilityId,
//       module,
//       lecturer,
//       trimester,
//       groups, 
//       status
//     });

//     // Insert Time records individually
//     for (const time of times) {
//       await TimeModel.create({
//         defaultgroupid: defaultGroup.id, // Use the id of the newly created DefaultGroup
//         day: time.day,
//         timeInterval: time.timeInterval,
//         facility: facilityId,
//       });
//     }

//     return {
//       success: true,
//       defaultGroup,
//       message: "Default groups and time intervals added successfully",
//     };
//   } catch (error) {
//     console.error("Error assigning default groups:", error);
//     return {
//       success: false,
//       message: error.message,
//     };
//   }
// };


export const assignDefaultGroupsWithTimes = async (facilityId, { module, lecturer, trimester, groups, times }) => {
  try {
    
    // Ensure groups is an array of integers
    if (!Array.isArray(groups) || groups.some(group => typeof group !== 'number')) {
      throw new Error("Groups must be an array of valid integers");
    }

    // Check for conflicts with other facilities for the same time and group
    for (const time of times) {
      const conflictingTimes = await TimeModel.findAll({
        where: {
          day: time.day,  // Same day
          timeInterval: time.timeInterval,  // Same time interval
        },
        include: [{
          model: DefaultGroupModel,
          as: 'defaultgroupTime',  // Alias defined in the association
          where: {
            facilityId: {
              [sequelize.Op.ne]: facilityId,  // Check for different facilities
            },
            status: 'active',  // Only consider active groups
          },
        }],
      });

      for (const conflictingTime of conflictingTimes) {
        const conflictingGroups = conflictingTime.defaultgroupTime.groups; // Get the assigned groups
        
        // Check for any overlapping groups
        for (const group of groups) {
          if (conflictingGroups.includes(group)) {
            return {
              success: false,
              message: `Conflict: Group ${group} is already assigned to another facility at ${time.timeInterval} on ${time.day}.`,
            };
          }
        }
      }
    }

    // Check for conflicts with the same facility and same time
    for (const time of times) {
      const conflictingTime = await TimeModel.findOne({
        where: {
          facility: facilityId,  // Check for the same facility
          day: time.day,  // Check for the same day
          timeInterval: time.timeInterval,  
        },
        include: [{
          model: DefaultGroupModel,
          as: 'defaultgroupTime',
          where: {
            status: 'active',  // Only consider active groups for the same facility
          }
        }]
      });

      if (conflictingTime) {
        return {
          success: false,
          message: `Conflict: The ${time.timeInterval} on ${time.day} is already assigned to another active group.`,
        };
      }
    }

    // Create DefaultGroup record
    const defaultGroup = await DefaultGroupModel.create({
      facilityId,
      module,
      lecturer,
      trimester,
      groups, 
      status: 'active',  // Set default status as active
    });

    // Insert Time records individually
    for (const time of times) {
      await TimeModel.create({
        defaultgroupid: defaultGroup.id, // Use the id of the newly created DefaultGroup
        day: time.day,
        timeInterval: time.timeInterval,
        facility: facilityId,
      });
    }

    return {
      success: true,
      defaultGroup,
      message: "Default groups and time intervals added successfully",
    };
  } catch (error) {
    console.error("Error assigning default groups:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const updateDefaultGroup = async (defaultGroupId, groups) => {
  try {
    // Ensure groups is an array of integers
    if (!Array.isArray(groups) || groups.some(group => typeof group !== 'number')) {
      throw new Error("Groups must be an array of valid integers");
    }

    // Fetch the existing DefaultGroup by ID and include the related time schedules
    const existingDefaultGroup = await DefaultGroupModel.findOne({
      where: { id: defaultGroupId },
      include: [
        {
          model: TimeModel,
          as: 'defaultgroupidTimes',  // Alias for the associated time records
        },
      ],
    });

    if (!existingDefaultGroup) {
      throw new Error("Default group does not exist");
    }

    // Extract facilityId and defaultgroupidTimes
    const { facilityId, defaultgroupidTimes = [] } = existingDefaultGroup;

    // Ensure defaultgroupidTimes is an array
    if (!Array.isArray(defaultgroupidTimes)) {
      throw new Error("Invalid time schedule format");
    }

    // Check for time conflicts with the groups being added
    for (const time of defaultgroupidTimes) {
      const { day, timeInterval } = time;

      // Check if the groups are assigned to other default groups with conflicting times
      const conflictingGroups = await DefaultGroupModel.findAll({
        include: [{
          model: TimeModel,
          as: 'defaultgroupidTimes',
          where: {
            day,
            timeInterval,
          },
        }],
        where: {
          id: {
            [sequelize.Op.ne]: defaultGroupId, // Exclude the current group
          },
        },
      });

      // Check if any conflicting groups are found
      for (const group of conflictingGroups) {
        // Assuming `groups` is an array stored directly on the DefaultGroup instance
        const groupIds = group.groups; // Ensure you have this field defined on your model

        // Check if any of the new groups conflict with existing groups in the conflicting time
        for (const newGroup of groups) {
          if (groupIds && groupIds.includes(newGroup)) {
            return {
              success: false,
              message: `Conflict: Group ${newGroup} is already assigned to another default group at ${timeInterval} on ${day}.`,
            };
          }
        }
      }
    }

    // Merge existing groups with the new ones, avoiding duplicates
    const updatedGroups = [...new Set([...existingDefaultGroup.groups, ...groups])];

    // Update the DefaultGroup with the new groups
    existingDefaultGroup.groups = updatedGroups;
    await existingDefaultGroup.save();

    return {
      success: true,
      message: "Default groups updated successfully",
      updatedDefaultGroup: existingDefaultGroup,
    };

  } catch (error) {
    console.error("Error updating default groups:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const extractTimeData = (data) => {
    // Extract and return the time data you need
    return [
        { day: 'Monday', timeInterval: '08:00-10:00' },
        { day: 'Tuesday', timeInterval: '10:00-12:00' },
        // Add more time data based on your logic
    ];
};



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
        {
          model: TimeModel,
          as: "timeOccupied",
          attributes: ["day", "timeInterval"],
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

// export const getOneFacility = async (id) => {
//   try {
//     const facility = await FacilitiesModel.findOne({
//       where: { id },
//       include: [
//         {
//           model: Users,
//           as: 'manager',
//           attributes: ['id', 'firstname', 'lastname', 'email', 'phone'],
//           required: false,
//         },
//         {
//           model: Users,
//           as: 'technician',
//           attributes: ['id', 'firstname', 'lastname', 'email', 'phone'],
//           required: false,
//         },
//         {
//           model: DefaultGroupModel,
//           as: 'facilitydefaultGroups',
//           attributes: ['id', 'time', 'trimester', 'groups'],
//           required: false,
//         },
//       ],
//     });

//     if (!facility) {
//       return null;
//     }

//     const defaultGroupsWithDetails = await Promise.all(
//       facility.facilitydefaultGroups.map(async (defaultGroup) => {
//         if (!defaultGroup.groups || defaultGroup.groups.length === 0) {
//           return defaultGroup;
//         }

//         const groupsWithObjects = await Promise.all(
//           defaultGroup.groups.map(async (groupId) => {
//             const group = await GroupModel.findOne({
//               attributes: ['id', 'name', 'size'],
//               where: { id: groupId },
//               include: [
//                 {
//                   model: IntakeModel,
//                   include: [
//                     {
//                       model: ProgramModel,
//                       attributes: ['id', 'name'],
//                       include: [
//                         {
//                           model: DepartmentModel,
//                           attributes: ['id', 'name'],
//                           include: [
//                             {
//                               model: SchoolModel,
//                               attributes: ['id', 'name'],
//                               include: [
//                                 {
//                                   model: CollegeModel,
//                                   attributes: ['id', 'name', 'abbreviation'],
//                                 },
//                               ],
//                             },
//                           ],
//                         },
//                       ],
//                     },
//                   ],
//                 },
//               ],
//             });

//             return {
//               id: group.id,
//               name: group.name,
//               size: group.size,
//               intake: group.Intake
//                 ? {
//                     id: group.Intake.id,
//                     name: group.Intake.displayName,
//                     program: group.Intake.program
//                       ? {
//                           id: group.Intake.program.id,
//                           name: group.Intake.program.name,
//                           department: group.Intake.program.department
//                             ? {
//                                 id: group.Intake.program.department.id,
//                                 name: group.Intake.program.department.name,
//                                 school: group.Intake.program.department.School
//                                   ? {
//                                       id: group.Intake.program.department.School.id,
//                                       name: group.Intake.program.department.School.name,
//                                       college: group.Intake.program.department.School.college
//                                         ? {
//                                             id: group.Intake.program.department.School.college.id,
//                                             name: group.Intake.program.department.School.college.name,
//                                             abbreviation: group.Intake.program.department.School.college.abbreviation,
//                                           }
//                                         : null,
//                                     }
//                                   : null,
//                               }
//                             : null,
//                       }
//                     : null,
//                   }
//                 : null,
//             };
//           })
//         );

//         return {
//           ...defaultGroup.toJSON(),
//           groups: groupsWithObjects,
//         };
//       })
//     );

//     return {
//       ...facility.toJSON(),
//       facilitydefaultGroups: defaultGroupsWithDetails,
//     };
//   } catch (error) {
//     throw new Error(`Error getting facility: ${error.message}`);
//   }
// };





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
          model: TimeModel,
          as: "timeOccupied",
          attributes: ["day", "timeInterval"],
          required: false,
        },
        {
          model: DefaultGroupModel,
          as: 'facilitydefaultGroups',
          attributes: ['id', 'module', 'lecturer', 'trimester' ,'status','groups'],
          required: false,
          include: [
            {
              model: TimeModel,
              as: "defaultgroupidTimes",
            },]
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

export const removeGroupFromAllDefaultGroups = async (groupId) => {
  try {
    const defaultGroups = await DefaultGroupModel.findAll();
    if (!defaultGroups || defaultGroups.length === 0) {
      throw new Error("No default groups found.");
    }
    await Promise.all(
      defaultGroups.map(async (defaultGroup) => {
        const groupsArray = typeof defaultGroup.groups === 'string'
          ? JSON.parse(defaultGroup.groups)
          : defaultGroup.groups;
        if (groupsArray.includes(groupId)) {
          const updatedGroups = groupsArray.filter(
            (group) => group.toString() !== groupId.toString()
          );
          if (updatedGroups.length === 0) {
            await DefaultGroupModel.destroy({ where: { id: defaultGroup.id } });
            console.log(`DefaultGroup with ID ${defaultGroup.id} deleted as no groups remain.`);
          } else {
            const updateResult = await DefaultGroupModel.update(
              { groups: updatedGroups },
              { where: { id: defaultGroup.id } }
            );
            if (updateResult[0] === 0) {
              throw new Error(`Failed to update the default groups for ID ${defaultGroup.id}.`);
            }
          }
        }
      })
    );

    return true; 
  } catch (error) {
    throw new Error(`Error removing group from all default groups: ${error.message}`);
  }
};


export const removeAllDefaultGroups = async (facilityId) => {
  try {
   
    const result = await DefaultGroupModel.destroy({
      where: { facilityId },
    });

    if (result === 0) {
      throw new Error("No default groups found for the specified facility.");
    }

    return result; 
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
          attributes: ['id', 'module', 'lecturer', 'trimester','status' ,'groups'],
          required: false,
          include: [
            {
              model: TimeModel,
              as: "defaultgroupidTimes",
            },]
        },
      ],
    });

    if (!facilities || facilities.length === 0) {
      return null;
    }

    const facilitiesWithDefaultGroups = await Promise.all(
      facilities.map(async (facility) => {
        const facilityDefaultGroups = facility.facilitydefaultGroups || [];
        if (facilityDefaultGroups.length === 0) {
          return null; 
        }

        const groupsWithObjects = await Promise.all(
          facilityDefaultGroups.map(async (defaultGroup) => {
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

export const getFacilitiesHasDefaultGroupsForStudent = async () => {
  try {
    const facilities = await FacilitiesModel.findAll({
      include: [
        {
          model: campusModel,
          as: 'campus',
          attributes: ['id', 'name'],
          required: true,
        },
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
          attributes: ['id', 'module', 'lecturer', 'trimester', 'groups','status'],
          required: false,
          include: [
            {
              model: TimeModel,
              as: "defaultgroupidTimes",
            },]
        },
      ],
    });

    if (!facilities || facilities.length === 0) {
      return null;
    }

    const facilitiesWithDefaultGroups = await Promise.all(
      (facilities || []).map(async (facility) => {
        if (!facility) {
          return null; // Return null if facility is not defined
        }

        const facilityDefaultGroups = facility.facilitydefaultGroups || [];

        if (facilityDefaultGroups.length === 0) {
          return null;
        }

        const groupsWithObjects = await Promise.all(
          facilityDefaultGroups.map(async (defaultGroup) => {
            if (!defaultGroup.groups || defaultGroup.groups.length === 0) {
              return defaultGroup;
            }

            const groupsWithObjects = await Promise.all(
              defaultGroup.groups.map(async (groupId) => {
                const group = await GroupModel.findOne({
                  attributes: ['id', 'name', 'size', 'code'], // Fetch the code field here
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
                  code: group.code, // Return group code here
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
                                                abbreviation:
                                                  group.Intake.program.department.School.college.abbreviation,
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

    return facilitiesWithDefaultGroups.filter((facility) => facility !== null);
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
          attributes: ['id', 'module', 'lecturer', 'trimester', 'groups','status'],
          required: false,
          include: [
            {
              model: TimeModel,
              as: "defaultgroupidTimes",
            },]
        },
      ],
    });

    if (!facilities || facilities.length === 0) {
      return null;
    }

    const facilitiesWithDefaultGroups = await Promise.all(
      facilities.map(async (facility) => {
        const facilityDefaultGroups = facility.facilitydefaultGroups || [];

        if (facilityDefaultGroups.length === 0) {
          return null; 
        }

        const groupsWithObjects = await Promise.all(
          facilityDefaultGroups.map(async (defaultGroup) => {
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
          facilitydefaultGroups: groupsWithObjects,
        };
      })
    );

    return facilitiesWithDefaultGroups.filter(facility => facility !== null);
  } catch (error) {
    throw new Error(`Error getting facilities: ${error.message}`);
  }
};


export const addTimeToDefaultGroup = async (day, timeInterval, defaultGroupId) => {
  try {
    // Find the default group by ID and include the facility information
    const defaultGroup = await DefaultGroupModel.findOne({
      where: { id: defaultGroupId },
      include: [{
        model: FacilitiesModel, // Ensure to import and use your Facility model
        as: 'facility',
      }],
    });

    if (!defaultGroup) {
      throw new Error("Default group does not exist");
    }

    // Get the facility ID from the found default group
    const facilityId = defaultGroup.facilityId;

    // Check if there is already a time entry for this day, timeInterval, and defaultGroupId
    const existingTimeEntry = await TimeModel.findOne({
      where: {
        defaultgroupid: defaultGroupId,
        facility: facilityId, 
        day,
        timeInterval,
      },
    });

    if (existingTimeEntry) {
      return {
        success: false,
        message: `A time entry for ${day} at ${timeInterval} already exists for this default group.`,
      };
    }

    // Create a new time entry since no conflicts exist
    const newTimeEntry = await TimeModel.create({
      day,
      timeInterval,
      facility: facilityId, // Save the facility from the default group
      defaultgroupid: defaultGroupId, // Associate the time with the default group
    });

    return {
      success: true,
      message: "Time added successfully",
      newTime: newTimeEntry,
    };
  } catch (error) {
    console.error("Error adding time to default group:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const deleteTimeById = async (timeId) => {
  try {
    // Find the time entry by ID
    const timeEntry = await TimeModel.findOne({
      where: { id: timeId },
    });

    if (!timeEntry) {
      return {
        success: false,
        message: "Time entry not found",
      };
    }

    // Delete the time entry
    await timeEntry.destroy();

    return {
      success: true,
      message: "Time entry deleted successfully",
    };

  } catch (error) {
    console.error("Error deleting time entry:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};


export const getDefaultGroupsWithTimes = async () => {
  try {
    const TimeTable = await TimeModel.findAll({
      include: [
        {
          model: DefaultGroupModel,
          as: 'defaultgroupTime', // Ensure this matches your association alias
          include: [
            {
              model: FacilitiesModel,
              as: 'facility', // Ensure this matches your association alias
            },
          ],
        },
      ],
    });

    if (!TimeTable) {
      return null;
    }

    const timeTableWithGroupDetails = await Promise.all(
      TimeTable.map(async (timeEntry) => {
        const defaultGroup = timeEntry.defaultgroupTime;

        if (!defaultGroup.groups || defaultGroup.groups.length === 0) {
          return timeEntry;
        }

        const groupsWithDetails = await Promise.all(
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
          ...timeEntry.toJSON(),
          defaultgroupTime: {
            ...defaultGroup.toJSON(),
            groups: groupsWithDetails,
          },
        };
      })
    );

    return timeTableWithGroupDetails;
  } catch (error) {
    throw new Error(`Error getting facility: ${error.message}`);
  }
};


export const activateDefaultGroup = async (id) => {
  try {
    const defaultGroup = await DefaultGroupModel.findByPk(id);

    if (!defaultGroup) {
      throw new Error("DefaultGroup not found");
    }

    // Activate the group by setting status to 'active'
    defaultGroup.status = 'active';
    await defaultGroup.save();

    return defaultGroup;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deactivateDefaultGroup = async (id) => {
  try {
    const defaultGroup = await DefaultGroupModel.findByPk(id);

    if (!defaultGroup) {
      throw new Error("DefaultGroup not found");
    }

    // Deactivate the group by setting status to 'inactive'
    defaultGroup.status = 'inactive';
    await defaultGroup.save();

    return defaultGroup;
  } catch (error) {
    throw new Error(error.message);
  }
};



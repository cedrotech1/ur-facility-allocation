import db from "../database/models/index.js";
const userModel = db["Users"];
const departmentModel = db["department"];
const campusModel = db["Campus"];
const schoolModel = db["School"];
const CollegeModel = db["college"];
const programModel = db["program"];
const groupModel = db["Groups"];
const IntakeModel = db["Intake"];

export const creategroup = async (groupData) => {
  try {
    const newgroup = await groupModel.create(groupData);
    return newgroup;
  } catch (error) {
    throw new Error(`Error creating group: ${error.message}`);
  }
};

export const getgroupsWithCampus = async () => {
  return await group.findAll({
    include: [
      {
        model: Campus,
        attributes: ["campus_id", "name"], // Include only the necessary attributes of the Campus model
        as: "campus", // Alias for the included Campus model
      },
      {
        model: userModel,
        attributes: ["id", "firstname", "lastname", "email", "phone"],
        as: "cp",
      },
    ],
  });
};

export const deletegroup = async (id) => {
  const groupToDelete = await groupModel.findOne({ where: { id } });
  if (groupToDelete) {
    await groupModel.destroy({ where: { id } });
    return groupToDelete;
  }
  return null;
};

export const Onegroup = async (id) => {
  const group = await groupModel.findOne({ where: { id } });
  return group;
};

export const updategroup = async (id, group) => {
  const groupToUpdate = await groupModel.findOne({ where: { id } });
  if (groupToUpdate) {
    await groupModel.update(group, { where: { id } });
    return group;
  }
  return null;
};

export const checkExistinggroup = async (name, department_ID) => {
  return await groupModel.findOne({
    where: {
      name: name,
      department_ID: department_ID,
    },
  });
};

export const allgroups = async () => {
  const groups = await groupModel.findAll({
    attributes: { exclude: ["representative"] },
    include: [
      {
        model: userModel,
        attributes: ["id", "firstname", "lastname", "email", "phone"],
        as: "cp",
      },
      {
        model: IntakeModel,
        attributes: ["id", "displayName"],
        include: [
          {
            model: programModel,
            attributes: ["id", "name"],
            include: [
              {
                model: departmentModel,
                attributes: ["id", "name"],
                include: [
                  {
                    model: schoolModel,
                    attributes: ["id", "name"],
                    include: [
                      {
                        model: CollegeModel,
                        attributes: ["id", "name"],
                        include: [
                          {
                            model: campusModel,
                            attributes: ["id", "name"],
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
      },
    ],
    raw: true, // Flatten the result
  });
  // const formattedgroups = groups.map((group) => ({
  //   id: group.id,
  //   name: group.name,
  //   department_ID: group.department_ID,
  //   createdAt: group.createdAt,
  //   updatedAt: group.updatedAt,
  //   department: { name: group["department.name"] },
  //   school: { name: group["department.School.name"] },
  //   college: { name: group["department.School.college.name"] },
  //   campus: { name: group["department.School.college.Campus.name"] },
  // }));

  // return formattedgroups;
  return groups;
};

export const getOnegroupWithDetails = async (id) => {
  const groups = await groupModel.findByPk(id, {
    include: [
      {
        model: userModel,
        attributes: ["id", "firstname", "lastname", "email", "phone"],
        as: "cp",
      },
      {
        model: IntakeModel,
        attributes: ["id", "displayName"],
        include: [
          {
            model: programModel,
            attributes: ["id", "name"],
            include: [
              {
                model: departmentModel,
                attributes: ["id", "name"],
                include: [
                  {
                    model: schoolModel,
                    attributes: ["id", "name"],
                    include: [
                      {
                        model: CollegeModel,
                        attributes: ["id", "name"],
                        include: [
                          {
                            model: campusModel,
                            attributes: ["id", "name"],
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
      },
    ],
    raw: true, // Flatten the result
  });

  // const formattedgroup = groups.map((group) => ({
  //   id: group.id,
  //   name: group.name,
  //   department_ID: group.department_ID,
  //   createdAt: group.createdAt,
  //   updatedAt: group.updatedAt,
  //   department: { name: group["department.name"] },
  //   school: { name: group["department.School.name"] },
  //   college: { name: group["department.School.College.name"] }, // Fix the typo here
  //   campus: { name: group["department.School.College.Campus.name"] }, // Fix the typo here
  // }));

  return groups;
};

export const getOneDepartmentWithDetails = async (id) => {
  return await groupModel.findByPk(id, {
    include: [
      {
        model: IntakeModel,
        attributes: ["displayName"],
        include: [
          {
            model: programModel,
            attributes: ["id", "name"],
            include: [
              {
                model: departmentModel,
                attributes: ["id", "name"],
                include: [
                  {
                    model: schoolModel,
                    attributes: ["id", "name"],
                    include: [
                      {
                        model: CollegeModel,
                        attributes: ["id", "name"],
                        include: [
                          {
                            model: campusModel,
                            attributes: ["id", "name"],
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
      },
      {
        model: userModel,
        attributes: ["id", "firstname", "lastname", "email", "phone"],
        as: "cp",
      },
    ],
    raw: true, // Flatten the result
  });
};
// checkExistinggroupByid

export const checkExistinggroupByid = async (id) => {
  return await groupModel.findOne({
    where: {
      id,
    },
  });
};

export const check = async (name, intake_id) => {
  return await groupModel.findOne({
    where: {
      name: name,
      intake_id: intake_id,
    },
  });
};
export const get_Group = async (id) => {
  return await groupModel.findByPk(id, {
    include: [
      {
        model: userModel,
        attributes: ["id", "firstname", "lastname", "email", "phone"],
        as: "cp",
      },
    ],
  });
};

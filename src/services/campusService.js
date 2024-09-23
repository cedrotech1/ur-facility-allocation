import db from "../database/models/index.js";
const campusModel = db["Campus"];
const CollegeModel = db["college"];
const schoolModel = db["School"];
const departmentModel = db["department"];
const programModel = db["program"];
const UserModel = db["Users"];
const Intake = db["Intake"];
const groupModel = db["Groups"];


// make sure to import your actual models and Sequelize

// export const campusWithAll = async () => {
//   const campuses = await campusModel.findAll({
//     include: [
//       {
//         model: CollegeModel,
//         attributes: ["id", "abbreviation", "name", "createdAt", "updatedAt"],
//         include: [
//           {
//             model: schoolModel,
//             attributes: ["id", "name", "createdAt", "updatedAt"],
//             include: [
//               {
//                 model: departmentModel,
//                 attributes: ["id", "name", "createdAt", "updatedAt"],
//                 include: [
//                   {
//                     model: programModel,
//                     attributes: ["id", "name", "createdAt", "updatedAt"],
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   });

//   // Sort campuses based on the number of colleges
//   campuses.sort((a, b) => b.colleges?.length - a.colleges?.length);

//   return campuses;
// };
export const campusWithAll = async () => {
  try {
    const campuses = await campusModel.findAll({
      include: [
        {
          model: CollegeModel,
          attributes: ["id", "abbreviation", "name", "createdAt", "updatedAt"],
          include: [
            {
              model: schoolModel,
              attributes: ["id", "name", "createdAt", "updatedAt"],
              include: [
                {
                  model: departmentModel,
                  attributes: ["id", "name", "createdAt", "updatedAt"],
                  include: [
                    {
                      model: programModel,
                      attributes: ["id", "name", "createdAt", "updatedAt"],
                      include: [
                        {
                          model: Intake,
                          attributes: ["id", "displayName", "createdAt", "updatedAt"],
                          include: [
                            {
                              model: groupModel,
                              attributes: ["id", "name", "createdAt", "updatedAt"],
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
          model: UserModel,
          as: "systemcampusadmin",
          where: { role: "systemcampusadmin" },
          attributes: ["id", "firstname", "lastname", "email", "phone"],
          required: false, 
        },
      ],
    });

    return campuses;
  } catch (error) {
    console.error("Error fetching campuses:", error);
    throw error; // You may want to handle the error more appropriately in your application
  }
};


export const createCampus = async (campusData) => {
  try {
    return await campusModel.create(campusData);
  } catch (error) {
    throw new Error(`Error creating campus: ${error.message}`);
  }
};

export const checkExistingCampus = async (name) => {
  return await campusModel.findOne({
    where: {
      name,
    },
  });
};

export const getAllCampuses = async () => {
  return await campusModel.findAll();
};

export const deleteOneCampus = async (id) => {
  const campusToDelete = await campusModel.findOne({ where: { id } });
  if (campusToDelete) {
    await campusModel.destroy({ where: { id } });
    return campusToDelete;
  }
  return null;
};

export const getOneCampusWithDetails = async (id) => {
  try {
    return await campusModel.findByPk(id, {
      include: [
        {
          model: CollegeModel,
          attributes: ["id", "abbreviation", "name", "createdAt", "updatedAt"],
          include: [
            {
              model: schoolModel,
              attributes: ["id", "name", "createdAt", "updatedAt"],
              include: [
                {
                  model: departmentModel,
                  attributes: ["id", "name", "createdAt", "updatedAt"],
                  include: [
                    {
                      model: programModel,
                      attributes: ["id", "name", "createdAt", "updatedAt"],
                      include: [
                        {
                          model: Intake,
                          attributes: ["id", "displayName", "createdAt", "updatedAt"],
                          include: [
                            {
                              model: groupModel,
                              attributes: ["id", "name", "createdAt", "updatedAt"],
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
          model: UserModel,
          as: "systemcampusadmin",
          where: { role: "systemcampusadmin" },
          attributes: ["id", "firstname", "lastname", "email", "phone"],
          separate: true,
          required: false,
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching campus details:", error);
    throw error; // You may want to handle the error more appropriately in your application
  }
};

export const updateOneCampus = async (id, campus) => {
  const campusToUpdate = await campusModel.findOne({ where: { id } });
  if (campusToUpdate) {
    await campusModel.update(campus, { where: { id } });
    return campus;
  }
  return null;
};

export const Onecampus = async (id) => {
  return await campusModel.findOne({
    where: {
      id,
    },
  });
};

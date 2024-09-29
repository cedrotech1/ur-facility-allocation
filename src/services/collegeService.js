import db from "../database/models/index.js";
const campusModel = db["Campus"];
const CollegeModel = db["college"];
const schoolModel = db["School"];
const departmentModel = db["department"];
const programModel = db["program"];
const Intake = db["Intake"];
const groupModel = db["Groups"];

export const createCollege = async (collegeData) => {
  try {
    const newCollege = await CollegeModel.create(collegeData);
    return newCollege;
  } catch (error) {
    throw new Error(`Error creating college: ${error.message}`);
  }
};

export const colleges = async () => {
  const campuses = await CollegeModel.findAll({
 
    include: [
      {
        model: campusModel,
        attributes: ["id", "name"],
      },
      {
        model: schoolModel,
        attributes: ["id", "name"],
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
  });

  // Sort campuses based on the number of colleges
  campuses.sort((a, b) => b.colleges?.length - a.colleges?.length);

  return campuses;
};

export const checkExistingCollege = async (name, campus_id) => {
  return await CollegeModel.findOne({
    where: {
      name: name,
      campus_id: campus_id,
    },
  });
};

export const getOneCollegeWithDetails = async (id) => {
  return await CollegeModel.findByPk(id, {
    // attributes: {
    //   exclude: ["campus_id"], 
    // },
    include: [
      {
        model: campusModel,
        attributes: ["id", "name"],
      },
      {
        model: schoolModel,
        attributes: ["id", "name"],
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
  });
};

export const checkExistingCampusByid = async (id) => {
  return await campusModel.findOne({
    where: {
      id,
    },
  });
};

export const getCollegesWithCampus = async () => {
  return await CollegeModel.findAll({
    include: [
      {
        model: Campus,
        attributes: ["campus_id", "name"], // Include only the necessary attributes of the Campus model
        as: "campus", // Alias for the included Campus model
      },
    ],
  });
};

export const deleteCollege = async (id) => {
  const CollegeToDelete = await CollegeModel.findOne({ where: { id } });
  if (CollegeToDelete) {
    await CollegeModel.destroy({ where: { id } });
    return CollegeToDelete;
  }
  return null;
};

export const OneCollege = async (id) => {
  const college = await CollegeModel.findOne({ where: { id } });
  return college;
};

export const updateCollege = async (id, college) => {
  const CollegeToUpdate = await CollegeModel.findOne({ where: { id } });
  if (CollegeToUpdate) {
    await CollegeModel.update(college, { where: { id } });
    return college;
  }
  return null;
};

import db from "../database/models/index.js";
const departmentModel = db["department"];
const campusModel = db["Campus"];
const schoolModel = db["School"];
const CollegeModel = db["college"];
const programModel = db["program"];
const Intake = db["Intake"];
const groupModel = db["Groups"];
const ModulesModel = db["Module"];

export const allprograms = async () => {
  const programs = await programModel.findAll({
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
      {
        model: Intake, // Include the IntakeModel
        attributes: ["id", "displayName", "createdAt", "updatedAt"],
        include: [
          {
            model: groupModel, // Include the GroupModel if applicable
            attributes: ["id", "name", "createdAt", "updatedAt"],
          },
        ],
      },
        {
          model: ModulesModel,
          as: "modules",
        }
    ],
  });
  return programs;
};

export const createprogram = async (programData) => {
  try {
    const newprogram = await programModel.create(programData);
    return newprogram;
  } catch (error) {
    throw new Error(`Error creating program: ${error.message}`);
  }
};

export const getprogramsWithCampus = async () => {
  return await program.findAll({
    include: [
      {
        model: Campus,
        attributes: ["id", "campus_id", "name"], // Include only the necessary attributes of the Campus model
        as: "campus", // Alias for the included Campus model
      },
    ],
  });
};

export const deleteprogram = async (id) => {
  const programToDelete = await programModel.findOne({ where: { id } });
  if (programToDelete) {
    await programModel.destroy({ where: { id } });
    return programToDelete;
  }
  return null;
};

export const Oneprogram = async (id) => {
  const program = await programModel.findOne({ where: { id } });
  return program;
};

export const updateprogram = async (id, program) => {
  const programToUpdate = await programModel.findOne({ where: { id } });
  if (programToUpdate) {
    await programModel.update(program, { where: { id } });
    return program;
  }
  return null;
};

export const checkExistingProgram = async (name, department_ID) => {
  return await programModel.findOne({
    where: {
      name: name,
      department_ID: department_ID,
    },
  });
};

export const getOneProgramWithDetails = async (id) => {
  const program = await programModel.findByPk(id, {
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
      {
        model: Intake, // Include the IntakeModel
        attributes: ["id", "displayName", "createdAt", "updatedAt"],
        include: [
          {
            model: groupModel, // Include the GroupModel if applicable
            attributes: ["id", "name", "createdAt", "updatedAt"],
          },
        ],
      },
      {
        model: ModulesModel,
        as: "modules",
      }
    ],
  });
  return program;
};

// checkExistingProgramByid

export const checkExistingProgramByid = async (id) => {
  return await programModel.findOne({
    where: {
      id,
    },
  });
};

export const check = async (name, department_ID) => {
  return await programModel.findOne({
    where: {
      name: name,
      department_ID: department_ID,
    },
  });
};

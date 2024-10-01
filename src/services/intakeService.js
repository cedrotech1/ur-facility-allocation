import db from "../database/models";
const Intake = db["Intake"];
const programModel = db["program"];
const departmentModel = db["department"];
const schoolModel = db["School"];
const CollegeModel = db["college"];
const campusModel = db["Campus"];
const groupModel = db["Groups"];

export const getIntakeById = async (id) => {
  const intake = await Intake.findByPk(id, {
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
      {
        model: groupModel,
        attributes: ["id", "name", "size"],
      },
    ],
  });
  return intake;
};

export const allIntakes = async () => {
  const allIntakes = await Intake.findAll({
    include: [
      {
        model: groupModel,
        attributes: ["id", "name", "size"],
      },
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
  });
  return allIntakes;
};


export const checkExistingIntake = async (intakeData) => {
  try {
    const { Year, Month, program_ID } = intakeData;
    const existingIntake = await Intake.findOne({
      where: {
        Year,
        Month,
        program_ID
      },
    });

    return existingIntake; // Return the existing intake or null if not found
  } catch (error) {
    throw new Error(`Error checking existing intake: ${error.message}`);
  }
};

export const createIntake = async (intake) => {
  const newIntake = await Intake.create(intake);
  return newIntake;
};

export const editIntake = async (id, intake) => {
  const intakeToUpdate = await Intake.findOne({ where: { id } });
  if (intakeToUpdate) {
    await Intake.update(intake, { where: { id } });
    return intake;
  }
  return null;
};

export const removeIntake = async (id) => {
  const intakeToDelete = await Intake.findOne({ where: { id } });
  if (intakeToDelete) {
    await Intake.destroy({ where: { id } });
    return intakeToDelete;
  }
  return null;
};

export const getProgramIntakes = async (program_ID) => {
  const programIntakes = await Intake.findAll({
    where: { program_ID },
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
      {
        model: groupModel,
        attributes: ["id", "name", "size"],
      },
    ],
  });
  return programIntakes;
};


export const getProgramIntakesByYear = async (program_ID, year) => {
  const programIntakes = await Intake.findAll({
    where: { program_ID, Year: year },
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
      {
        model: groupModel,
        attributes: ["id", "name", "size"],
      },
    ],
  });
  return programIntakes;
};


export const getProgramIntakesByMonth = async (program_ID, month) => {
  const programIntakes = await Intake.findAll({
    where: { program_ID,Month: month },
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
      {
        model: groupModel,
        attributes: ["id", "name", "size"],
      },
    ],
  });
  return programIntakes;
};


export const getProgramIntakesByYearMonth = async (program_ID, year, month) => {
  const programIntakes = await Intake.findAll({
    where: { program_ID,Year: year,Month: month },
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
      {
        model: groupModel,
        attributes: ["id", "name", "size"],
      },
    ],
  });
  return programIntakes;
};


export const getProgramIntakesByYearMonthRange = async (
  program_ID,
  year,
  Month,

) => {
  const programIntakes = await Intake.findAll({
    where: { program_ID,Year: year, Month: [Month,Month] },
  });
  return programIntakes;
};

export const getProgramIntakesByYearRange = async (
  program_ID,
  Year,
) => {
  const programIntakes = await Intake.findAll({
    where: { program_ID, Year: [Year,Year] },
  });
  return programIntakes;
};

export const getProgramIntakesByMonthRange = async (
  program_ID,
  Month,
) => {
  const programIntakes = await Intake.findAll({
    where: { program_ID, startMonth: [Month,Month] },
  });
  return programIntakes;
};

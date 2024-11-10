import {
  createIntake,
  getIntakeById,
  allIntakes,
  getProgramIntakes,
  getProgramIntakesByMonth,
  getProgramIntakesByMonthRange,
  getProgramIntakesByYear,
  getProgramIntakesByYearMonth,
  getProgramIntakesByYearMonthRange,
  getProgramIntakesByYearRange,
  editIntake,
  removeIntake,
  checkExistingIntake,
} from "../services/intakeService.js";
import { Oneprogram } from "../services/programService.js";
import { checkprivileges } from "../helpers/privileges";

export const addIntake = async (req, res) => {
  try {
    if (!checkprivileges(req.user.privileges, "manage-intakes")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    console.log(req.user.privileges)
    const requiredFields = [
      "Year",
      "Month",
      "program_ID",
    ];
    for (const field of requiredFields) {
      if (!req.body[field] || req.body[field] === "") {
        return res.status(400).send({
          success: false,
          message: `${
            field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ")
          } cannot be empty`,
        });
      }
    }

    const existingProgram = await Oneprogram(req.body.program_ID);
    if (!existingProgram) {
      return res.status(400).send({
        success: false,
        message: "Program ID not found",
      });
    }
    if (await checkExistingIntake(req.body)) {
      return res.status(400).send({
        success: false,
        message: "Intake with similar details already exists",
      });
    }
    req.body.displayName = `${req.body.Year} ${req.body.Month} - ${existingProgram.name}`;
    const intake = await createIntake(req.body);
    return res.status(201).send({
      success: true,
      message: "Intake created successfully",
      intake,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: `Error creating intake: ${error.message}`,
    });
  }
};

export const getIntakes = async (req, res) => {
  try {
    const userCampusId = req.user.campus;
    let intakes = await allIntakes();

    if (!intakes || intakes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Intakes not found",
        intakes:[]
      });
    }

  
    intakes = intakes?.filter(intake =>
      intake?.program?.department?.School?.college?.Campus.id === userCampusId
    );

    return res.status(200).json({
      success: true,
      message: "Intakes retrieved successfully",
      intakes,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Error retrieving intakes: ${error.message}`,
    });
  }
};


export const getOneIntake = async (req, res) => {
  try {
    const userCampusId = req.user.campus;
    const intakeId = req.params.id;
    const intake = await getIntakeById(intakeId);

    if (!intake) {
      return res.status(404).json({
        success: false,
        message: "Intake not found",
      });
    }

    const intakeCampusId = intake.program.department.School.college.Campus.id;
    if (intakeCampusId !== userCampusId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this intake",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Intake retrieved successfully",
      intake,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Error retrieving intake: ${error.message}`,
    });
  }
};


export const updateIntake = async (req, res) => {
  try {
    if (!checkprivileges(req.user.privileges, "manage-intakes")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    const existingIntake = await getIntakeById(req.params.id);
    req.body.Year = req.body.Year
      ? req.body.Year
      : existingIntake.Year;
    req.body.Month = req.body.Month
      ? req.body.Month
      : existingIntake.Month;
    req.body.program_ID = existingIntake.program_ID;

    if (await checkExistingIntake(req.body)) {
      return res.status(400).send({
        success: false,
        message: "Intake with similar details already exists",
      });
    }

    const existingProgram = await Oneprogram(existingIntake.program_ID);

    req.body.displayName = `${req.body.Year} ${req.body.Month} - ${existingProgram.name}`;
    const intake = await editIntake(req.params.id, req.body);
    if (!intake) {
      return res.status(404).send({
        success: false,
        message: "Intake not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Intake updated successfully",
      intake,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: `Error updating intake: ${error.message}`,
    });
  }
};

export const deleteIntake = async (req, res) => {
  try {
    if (!checkprivileges(req.user.privileges, "manage-intakes")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    const intake = await removeIntake(req.params.id);
    if (!intake) {
      return res.status(404).send({
        success: false,
        message: "Intake not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Intake deleted successfully",
      intake,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: `Error deleting intake: ${error.message}`,
    });
  }
};

export const getIntakesByProgram = async (req, res) => {
  try {
    const userCampusId = req.user.campus;
    const programId = req.params.id;
    let intakes = await getProgramIntakes(programId);
    if (!intakes || intakes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Intakes not found for the program",
      });
    }
    intakes = intakes.filter(intake =>
      intake.program.department.School.college.Campus.id === userCampusId
    );

    return res.status(200).json({
      success: true,
      message: "Intakes retrieved successfully",
      intakes,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Error retrieving intakes: ${error.message}`,
    });
  }
};


export const getIntakesByProgramYear = async (req, res) => {
  try {
    const intakes = await getProgramIntakesByYear(
      req.params.id,
      req.params.year
    );
    return res.status(200).send({
      success: true,
      message: "Intakes retrieved successfully",
      intakes,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: `Error retrieving intakes: ${error.message}`,
    });
  }
};

export const getIntakesByProgramMonth = async (req, res) => {
  try {
    const intakes = await getProgramIntakesByMonth(
      req.params.program_ID,
      req.params.month
    );
    return res.status(200).send({
      success: true,
      message: "Intakes retrieved successfully",
      intakes,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: `Error retrieving intakes: ${error.message}`,
    });
  }
};

export const getIntakesByProgramYearMonth = async (req, res) => {
  try {
    const intakes = await getProgramIntakesByYearMonth(
      req.params.program_ID,
      req.params.year,
      req.params.month
    );
    return res.status(200).send({
      success: true,
      message: "Intakes retrieved successfully",
      intakes,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: `Error retrieving intakes: ${error.message}`,
    });
  }
};

export const getIntakesByProgramYearMonthRange = async (req, res) => {
  try {
    const intakes = await getProgramIntakesByYearMonthRange(
      req.params.program_ID,
      req.params.year,
      req.params.startMonth,
      req.params.endMonth
    );
    return res.status(200).send({
      success: true,
      message: "Intakes retrieved successfully",
      intakes,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: `Error retrieving intakes: ${error.message}`,
    });
  }
};

// export const getIntakesByProgramYearRange = async (req, res) => {
//   try {
//     const intakes = await getProgramIntakesByYearRange(
//       req.params.program_ID,
//       req.params.startYear,
//       req.params.endYear
//     );
//     return res.status(200).send({
//       success: true,
//       message: "Intakes retrieved successfully",
//       intakes,
//     });
//   } catch (error) {
//     return res.status(400).send({
//       success: false,
//       message: `Error retrieving intakes: ${error.message}`,
//     });
//   }
// };

export const getIntakesByProgramMonthRange = async (req, res) => {
  try {
    const intakes = await getProgramIntakesByMonthRange(
      req.params.program_ID,
      req.params.startMonth,
      req.params.endMonth
    );
    return res.status(200).send({
      success: true,
      message: "Intakes retrieved successfully",
      intakes,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: `Error retrieving intakes: ${error.message}`,
    });
  }
};

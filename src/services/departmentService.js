import db from "../database/models/index.js";
const departmentModel = db["department"];
const campusModel = db["Campus"];
const schoolModel = db["School"];
const CollegeModel = db["college"];
const programModel = db["program"];
const Intake = db["Intake"];
const groupModel = db["Groups"];

export const createdepartment = async (departmentData) => {
  try {
    const newdepartment = await departmentModel.create(departmentData);
    return newdepartment;
  } catch (error) {
    throw new Error(`Error creating department: ${error.message}`);
  }
};

export const getdepartmentsWithCampus = async () => {
  return await department.findAll({
    include: [
      {
        model: Campus,
        attributes: ['campus_id', 'name'], // Include only the necessary attributes of the Campus model
        as: 'campus', // Alias for the included Campus model
      },
    ],
  });
};

export const deletedepartment = async (id) => {
  const departmentToDelete = await departmentModel.findOne({ where: { id } });
  if (departmentToDelete) {
    await departmentModel.destroy({ where: { id } });
    return departmentToDelete;
  }
  return null;
};

export const Onedepartment = async (id) => {
  const department = await departmentModel.findOne({ where: { id } });
  return department;
};

export const updatedepartment = async (id, department) => {
  const departmentToUpdate = await departmentModel.findOne({ where: { id } });
  if (departmentToUpdate) {
    await departmentModel.update(department, { where: { id } });
    return department;
  }
  return null;
};

export const alldepartments = async () => {
  const departments = await departmentModel.findAll({
    attributes: {
      exclude: ["school_ID"], // Exclude the 'school_ID' attribute from the Department model
    },
    
    include: [
      {
        model: schoolModel, // Replace 'CollegeModel' with 'SchoolModel'
        attributes: ["id", "name"], // Include only the 'name' attribute of the School model
        include: [
          {
            model: CollegeModel,
            attributes: ["id", "name", "abbreviation"], // Include only the 'name' attribute of the College model
            include: [
              {
                model: campusModel,
                attributes: ["id", "name"], // Include only the 'name' attribute of the Campus model
              },
            ],
          },
        ],
      },
      {
        model: programModel,
        attributes: ["id", "name", "createdAt", "updatedAt"], // Include only the specified attributes of the Program model
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
  });

 
  return departments;
};

export const getOneDepartmentWithDetails = async (id) => {
  return await departmentModel.findByPk(id, {
    attributes: {
      exclude: ["school_ID"], // Exclude the 'school_ID' attribute from the Department model
    },
    include: [
      {
        model: schoolModel, // Replace 'CollegeModel' with 'SchoolModel'
        attributes: ["id", "name"], // Include only the 'name' attribute of the School model
        include: [
          {
            model: CollegeModel,
            attributes: ["id", "name", "abbreviation"], // Include only the 'name' attribute of the College model
            include: [
              {
                model: campusModel,
                attributes: ["id", "name"], // Include only the 'name' attribute of the Campus model
              },
            ],
          },
        ],
      },
      {
        model: programModel,
        attributes: ["id", "name", "createdAt", "updatedAt"], // Include only the specified attributes of the Program model
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
  });
};
export const getOneDepartmentWithDetailsForGroup = async (id) => {
  return await departmentModel.findByPk(id, {
    attributes: {
      exclude: ["school_ID"], // Exclude the 'school_ID' attribute from the Department model
    },
    include: [
      {
        model: schoolModel, // Replace 'CollegeModel' with 'SchoolModel'
        attributes: ["id", "name"], // Include only the 'name' attribute of the School model
        include: [
          {
            model: CollegeModel,
            attributes: ["id", "name", "abbreviation"], // Include only the 'name' attribute of the College model
            include: [
              {
                model: campusModel,
                attributes: ["id", "name"], // Include only the 'name' attribute of the Campus model
              },
            ],
          },
        ],
      },
      {
        model: programModel,
        attributes: ["id", "name", "createdAt", "updatedAt"], // Include only the specified attributes of the Program model
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
  });
};

export const checkExistingDepartment = async (name, school_ID) => {
  return await departmentModel.findOne({
    where: {
      name: name,
      school_ID: school_ID,
    },
  });
};

export const checkExistingSchoolByid = async (id) => {
  return await schoolModel.findOne({
    where: {
      id,
    },
  });
};

// check if department exists by id
export const checkExistingDepartmentById = async (id) => {
  return await departmentModel.findOne({
    where: {
      id,
    },
  });
};

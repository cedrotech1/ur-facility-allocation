import db from "../database/models/index.js";
const schoolModel = db["School"];
const campusModel = db["Campus"];
const CollegeModel = db["college"];
const departmentModel = db["department"];
const programModel = db["program"];
const Intake = db["Intake"];
const groupModel = db["Groups"];
const Users = db["Users"];

export const createschool = async (schoolData) => {
  try {
    const newschool = await schoolModel.create(schoolData);
    return newschool;
  } catch (error) {
    throw new Error(`Error creating school: ${error.message}`);
  }
};

export const allschools = async () => {
  const campuses = await schoolModel.findAll({
    attributes: {
      exclude: ["college_ID"], // Exclude the 'college_ID' attribute from the School model
    },
   
    include: [
      {
        model: Users,
        as: "schooldean",
        attributes: ["id", "firstname", "lastname", "email", "phone"],
        required: false, 
      },
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
      {
        model: departmentModel,
        attributes: ["id", "name", "createdAt", "updatedAt"], // Include only the specified attributes of the Department model
        include: [
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
      },
    
    ],
  });

  // Sort campuses based on the number of colleges
  campuses.sort((a, b) => b.colleges?.length - a.colleges?.length);

  return campuses;
};

export const checkExistingCollegeByid = async (id) => {
  return await CollegeModel.findOne({
    where: {
      id,
    },
  });
};

export const checkExistingSchool = async (name, college_ID) => {
  return await schoolModel.findOne({
    where: {
      name: name,
      college_ID: college_ID,
    },
  });
};


export const getOneSchoolWithDetails = async (id) => {
  return await schoolModel.findByPk(id, {
    attributes: {
      exclude: ["dean"],
    },

    include: [
      {
        model: Users,
        as: "schooldean",
        attributes: ["id", "firstname", "lastname", "email", "phone"],
        required: false, 
      },
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
      {
        model: departmentModel,
        attributes: ["id", "name", "createdAt", "updatedAt"], // Include only the specified attributes of the Department model
        include: [
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
      },
    ],
  });
};

export const getschools = async () => {
  try {
    const schools = await schoolModel.findAll();
    return schools;
  } catch (error) {
    throw new Error(`Error getting schools: ${error.message}`);
  }
};

export const deleteschool = async (id) => {
  const schoolToDelete = await schoolModel.findOne({ where: { id } });
  if (schoolToDelete) {
    await schoolModel.destroy({ where: { id } });
    return schoolToDelete;
  }
  return null;
};

export const Oneschool = async (id) => {
  const school = await schoolModel.findOne({ where: { id } });
  return school;
};
export const deanschool = async (id) => {
  const school = await schoolModel.findOne({ where: { dean:id } });
  return school;
};

export const updateschool = async (id, school) => {
  const schoolToUpdate = await schoolModel.findOne({ where: { id } });
  if (schoolToUpdate) {
    await schoolModel.update(school, { where: { id } });
    return school;
  }
  return null;
};
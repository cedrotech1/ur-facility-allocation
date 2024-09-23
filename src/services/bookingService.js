import db from "../database/models/index.js";
const BookingModel = db["Bookings"];
const UserModel = db["Users"];
const FacilityModel = db["Facility"];
const GroupModel = db["Groups"];
const IntakeModel = db["Intake"];
const ProgramModel = db["program"];
const DepartmentModel = db["department"];
const SchoolModel = db["School"];
const CollegeModel = db["college"];

const { Op } = require("sequelize");

export const createBooking = async (BookingData) => {
  try {
    const newBooking = await BookingModel.create(BookingData);
    return newBooking;
  } catch (error) {
    throw new Error(`Error creating Booking: ${error.message}`);
  }
};

export const getBookings = async () => {
  try {
    const bookings = await BookingModel.findAll({
      attributes: [
        "id",
        "groups",
        "startPeriod",
        "endPeriod",
        "date",
        "status",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: UserModel,
          as: "User",
          attributes: {
            exclude: ["password"],
          },
        },
        { model: FacilityModel, as: "Facility" },
      ],
    });
    if (!bookings || bookings.length === 0) {
      return null;
    }
    const bookingWithGroupObjects = await Promise.all(
      bookings.map(async (booking) => {
        const groupNames = await GroupModel.findAll({
          attributes: ["id", "name", "size"],
          where: { id: booking.groups },
        });

        const groupsWithObjects = groupNames.map((group) => ({
          id: group.id,
          name: group.name,
          size: group.size,
        }));

        return {
          ...booking.toJSON(),
          groups: groupsWithObjects,
        };
      })
    );

    return bookingWithGroupObjects;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export const getRejectedBookings = async () => {
  try {
    const bookings = await BookingModel.findAll({
      where: {
        status: "rejected",
      },
      attributes: [
        "id",
        "groups",
        "startPeriod",
        "endPeriod",
        "date",
        "status",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: UserModel,
          as: "User",
          attributes: {
            exclude: ["password"],
          },
        },
        { model: FacilityModel, as: "Facility" },
      ],
    });

    if (!bookings || bookings.length === 0) {
      return null;
    }

    const bookingWithGroupObjects = await Promise.all(
      bookings.map(async (booking) => {
        const groupNames = await GroupModel.findAll({
          attributes: ["id", "name", "size"],
          where: { id: booking.groups },
        });

        const groupsWithObjects = groupNames.map((group) => ({
          id: group.id,
          name: group.name,
          size: group.size,
        }));

        return {
          ...booking.toJSON(),
          groups: groupsWithObjects,
        };
      })
    );

    return bookingWithGroupObjects;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};
export const getApprovedBookings = async () => {
  try {
    const bookings = await BookingModel.findAll({
      where: {
        status: "approved",
      },
      attributes: [
        "id",
        "groups",
        "startPeriod",
        "endPeriod",
        "date",
        "status",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: UserModel,
          as: "User",
          attributes: {
            exclude: ["password"],
          },
        },
        { model: FacilityModel, as: "Facility" },
      ],
    });

    if (!bookings || bookings.length === 0) {
      return null;
    }

    const bookingWithGroupObjects = await Promise.all(
      bookings.map(async (booking) => {
        const groupNames = await GroupModel.findAll({
          attributes: ["id", "name", "size"],
          where: { id: booking.groups },
        });

        const groupsWithObjects = groupNames.map((group) => ({
          id: group.id,
          name: group.name,
          size: group.size,
        }));

        return {
          ...booking.toJSON(),
          groups: groupsWithObjects,
        };
      })
    );

    return bookingWithGroupObjects;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export const getPendingBookings = async () => {
  try {
    const bookings = await BookingModel.findAll({
      where: {
        status: "pending",
      },
      attributes: [
        "id",
        "groups",
        "startPeriod",
        "endPeriod",
        "date",
        "status",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: UserModel,
          as: "User",
          attributes: {
            exclude: ["password"],
          },
        },
        { model: FacilityModel, as: "Facility" },
      ],
    });

    if (!bookings || bookings.length === 0) {
      return null;
    }

    const bookingWithGroupObjects = await Promise.all(
      bookings.map(async (booking) => {
        const groupNames = await GroupModel.findAll({
          attributes: ["id", "name", "size"],
          where: { id: booking.groups },
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

        const groupsWithObjects = groupNames.map((group) => ({
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
                                  college: group.Intake.program.department.School
                                    .college
                                    ? {
                                        id: group.Intake.program.department.School
                                          .college.id,
                                        name: group.Intake.program.department.School
                                          .college.name,
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

        return {
          ...booking.toJSON(),
          groups: groupsWithObjects,
        };
      })
    );

    return bookingWithGroupObjects;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export const getprePendingBookings = async () => {
  try {
    const bookings = await BookingModel.findAll({
      where: {
        status: "pre-pending",
      },
      attributes: [
        "id",
        "groups",
        "startPeriod",
        "endPeriod",
        "date",
        "status",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: UserModel,
          as: "User",
          attributes: {
            exclude: ["password"],
          },
        },
        { model: FacilityModel, as: "Facility" },
      ],
    });

    if (!bookings || bookings.length === 0) {
      return null;
    }

    const bookingWithGroupObjects = await Promise.all(
      bookings.map(async (booking) => {
        const groupNames = await GroupModel.findAll({
          attributes: ["id", "name", "size"],
          where: { id: booking.groups },
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

        const groupsWithObjects = groupNames.map((group) => ({
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
                                  college: group.Intake.program.department.School
                                    .college
                                    ? {
                                        id: group.Intake.program.department.School
                                          .college.id,
                                        name: group.Intake.program.department.School
                                          .college.name,
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

        return {
          ...booking.toJSON(),
          groups: groupsWithObjects,
        };
      })
    );

    return bookingWithGroupObjects;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export const getBookingsByFacility = async (id) => {
  try {
    const bookings = await BookingModel.findAll({
      where: { facility: id },
      attributes: [
        "id",
        "groups",
        "startPeriod",
        "endPeriod",
        "date",
        "status",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: UserModel,
          as: "User",
          attributes: {
            exclude: ["password"],
          },
        },
        { model: FacilityModel, as: "Facility" },
      ],
    });

    const groupsWithObjects = await Promise.all(
      bookings.map(async (booking) => {
        const groupNames = await GroupModel.findAll({
          attributes: ["id", "name", "size"],
          where: { id: booking.groups },
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
                {
                  model: GroupModel,
                  attributes: ["id", "name", "size"],
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
                                  name: group.Intake.program.department.School.name,
                                  college: group.Intake.program.department.School
                                    .college
                                    ? {
                                        id: group.Intake.program.department.School
                                          .college.id,
                                        name: group.Intake.program.department.School
                                          .college.name,
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

    const bookingsWithGroupObjects = bookings.map((booking, index) => ({
      ...booking.toJSON(),
      groups: groupsWithObjects[index],
    }));

    return bookingsWithGroupObjects;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};








export const getBookingsByClassRoom = async (id) => {
  try {
    const bookings = await BookingModel.findAll({
      where: { classRoom: id },
      attributes: [
        "id",
        "groups",
        "startPeriod",
        "endPeriod",
        "date",
        "status",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: UserModel,
          as: "User",
          attributes: {
            exclude: ["password"],
          },
        },
        { model: ClassRoomModel, as: "ClassRoom" },
      ],
    });

    if (!bookings) {
      return null;
    }

    const groupsWithObjects = await Promise.all(
      bookings.map(async (booking) => {
        const groupNames = await GroupModel.findAll({
          attributes: ["id", "name", "size"],
          where: { id: booking.groups },
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
                {
                  model: GroupModel,
                  attributes: ["id", "name", "size"],
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
                                  name: group.Intake.program.department.School.name,
                                  college: group.Intake.program.department.School
                                    .college
                                    ? {
                                        id: group.Intake.program.department.School
                                          .college.id,
                                        name: group.Intake.program.department.School
                                          .college.name,
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

    const bookingsWithGroupObjects = bookings.map((booking, index) => ({
      ...booking.toJSON(),
      groups: groupsWithObjects[index],
    }));

    return bookingsWithGroupObjects;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export const getOneBookingWithDetails = async (id) => {
  try {
    const booking = await BookingModel.findByPk(id, {
      attributes: [
        "id",
        "groups",
        "startPeriod",
        "endPeriod",
        "date",
        "status",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: UserModel,
          as: "User",
          attributes: {
            exclude: ["password"],
          },
        },
        { model: FacilityModel, as: "Facility" },
      ],
    });

    if (!booking) {
      return null;
    }

    const groupNames = await GroupModel.findAll({
      attributes: ["id", "name", "size"],
      where: { id: booking.groups },
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
                          attributes: ["id", "name","abbreviation"],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              model: GroupModel,
              attributes: ["id", "name", "size"],
            },
          ],
        },
      ],
    });

    const groupsWithObjects = groupNames.map((group) => ({
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
                              college: group.Intake.program.department.School
                                .college
                                ? {
                                    id: group.Intake.program.department.School
                                      .college.id,
                                    name: group.Intake.program.department.School
                                      .college.name,
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

    const bookingWithGroupObjects = {
      ...booking.toJSON(),
      groups: groupsWithObjects,
    };

    return bookingWithGroupObjects;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
};

export const getOnepreBookingWithDetails = async (id) => {
  try {
    let booking = await BookingModel.findOne({
      where: { 
        id: id,
        status: 'pre-pending' 
      },
      attributes: [
        "id",
        "groups",
        "startPeriod",
        "endPeriod",
        "date",
        "status",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: UserModel,
          as: "User",
          attributes: {
            exclude: ["password"],
          },
        },
        { model: FacilityModel, as: "Facility" },
      ],
    });


  
 
    if (!booking) {
      return null;
    }


    const groupNames = await GroupModel.findAll({
      attributes: ["id", "name", "size"],
      where: { id: booking.groups },
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
                          attributes: ["id", "name","abbreviation"],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              model: GroupModel,
              attributes: ["id", "name", "size"],
            },
          ],
        },
      ],
    });

    const groupsWithObjects = groupNames.map((group) => ({
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
                              college: group.Intake.program.department.School
                                .college
                                ? {
                                    id: group.Intake.program.department.School
                                      .college.id,
                                    name: group.Intake.program.department.School
                                      .college.name,
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

    const bookingWithGroupObjects = {
      ...booking.toJSON(),
      groups: groupsWithObjects,
    };

    return bookingWithGroupObjects;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
};
export const getoneBooking = async (id) => {
  const booking = await BookingModel.findOne({
    where: { id },
  });
  return booking;
};

export const approvebookings = async (id) => {
  const onebookToapproved = await BookingModel.findOne({ where: { id } });
  if (onebookToapproved) {
    await BookingModel.update({ status: "approved" }, { where: { id } });
    return onebookToapproved;
  }
  return null;
};

export const rejectingbookings = async (id) => {
  const onebookToreject = await BookingModel.findOne({ where: { id } });
  if (onebookToreject) {
    await BookingModel.update({ status: "rejected" }, { where: { id } });
    return onebookToreject;
  }
  return null;
};

export const prependingbookings = async (id) => {
  const onebookTopreapproved = await BookingModel.findOne({ where: { id } });
  if (onebookTopreapproved) {
    await BookingModel.update({ status: "pre-pending" }, { where: { id } });
    return onebookTopreapproved;
  }
  return null;
};


export const approveTOpendingbookings = async (id) => {
  const prepend = await BookingModel.findOne({ where: { id } });
  if (prepend) {
    await BookingModel.update({ status: "pending" }, { where: { id } });
    return prepend;
  }
  return null;
};


export const cancelBooking = async (id) => {
  const BookingToDelete = await BookingModel.findOne({ where: { id } });
  if (BookingToDelete) {
    await BookingModel.destroy({ where: { id } });
    return BookingToDelete;
  }
  return null;
};

export const updateBooking = async (id, Booking) => {
  const BookingToUpdate = await BookingModel.findOne({ where: { id } });
  if (BookingToUpdate) {
    await BookingModel.update(Booking, { where: { id } });
    return Booking;
  }
  return null;
};

export const getBookingsByFacilityWithinPeriod = async (id, startDate, endDate) => {
  try {
    const bookings = await BookingModel.findAll({
      where: {
        facility: id,
        // status: "approved",
        [Op.or]: [
          {
            startPeriod: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            endPeriod: {
              [Op.between]: [startDate, endDate],
            },
          },
        ],
      },
      attributes: [
        "id",
        "groups",
        "startPeriod",
        "endPeriod",
        "status",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: UserModel,
          as: "User",
          attributes: {
            exclude: ["password"],
          },
        },
        { model: FacilityModel, as: "Facility" },
      ],
    });

    const groupsWithObjects = await Promise.all(
      bookings.map(async (booking) => {
        const groupNames = await GroupModel.findAll({
          attributes: ["id", "name", "size"],
          where: { id: booking.groups },
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
                {
                  model: GroupModel,
                  attributes: ["id", "name", "size"],
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
                                  name: group.Intake.program.department.School.name,
                                  college: group.Intake.program.department.School
                                    .college
                                    ? {
                                        id: group.Intake.program.department.School
                                          .college.id,
                                        name: group.Intake.program.department.School
                                          .college.name,
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

    const bookingsWithGroupObjects = bookings.map((booking, index) => ({
      ...booking.toJSON(),
      groups: groupsWithObjects[index],
    }));

    return bookingsWithGroupObjects;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};



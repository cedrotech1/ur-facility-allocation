import bcrypt from "bcryptjs";
import crypto from "crypto";
import db from "../database/models/index.js";
import { Op } from "sequelize";
const Users = db["Users"];
const campusModel = db["Campus"];

export const createUser = async (user) => {
  // hashing password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  const newUser = await Users.create(user);
  return newUser;
};

export const saveUsersData = async (users) => {
  try {
    const createdUsers = [];
    for (const user of users) {
      const newUser = await Users.create(user);
      createdUsers.push(newUser);
    }
    return { createdUsers };
  } catch (error) {
    throw new Error('Error saving users: ' + error.message);
  }
};

export const getUser = async (id) => {
  const user = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  return user;
};

export const getUserByPrivilege = async (privilege, campus) => {
  try {
    const allUsers = await Users.findAll({
      where: { campus, status: "active" },
      attributes: {
        exclude: ["password", "resetPasswordToken", "resetPasswordExpires"],
      },
    });

    const filteredUsers = allUsers.filter((user) => {
      return user.privileges && user.privileges.includes(privilege);
    });

    return filteredUsers;
  } catch (error) {
    console.error("Error in getUserByPrivilege:", error);
    throw error;
  }
};

export const getUserByPrivilegeForLab = async (privilege, campus, id) => {
  try {
    const allUsers = await Users.findAll(
      {
        where: { campus, status: "active", id },
      },
      {
        attributes: {
          exclude: ["password"],
        },
      }
    );
    const filteredUsers = allUsers.filter((user) => {
      return user.privileges && user.privileges.includes(privilege);
    });

    return filteredUsers;
  } catch (error) {
    console.error("Error in getUserByPrivilege:", error);
    throw error;
  }
};

export const GetUserPassword = async (id) => {
  const user = await Users.findByPk(id, {
    attributes: ["password"],
  });
  return user ? user.password : null;
};

export const getUserByEmail = async (email) => {
  try {
    const user = await Users.findOne({
      where: { email },
      include: [
        {
          model: campusModel,
          as: "campusInfo", // Assuming this is the alias used for the Campus association
        },
      ],
    });

    return user;
  } catch (error) {
    // Handle errors here
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const getUsers = async (role) => {
  const allUsers = await Users.findAll({
    where: {
      role,
      role: { [Op.ne]: "lecturer" }, 
    },
    attributes: { exclude: ["password"] },
  });
  return allUsers;
};

export const getLect = async (role) => {
  const allUsers = await Users.findAll({
    where: {
      role
    },
    attributes: { exclude: ["password"] },
  });
  return allUsers;
};


export const getUsersByCampus = async (campus) => {
  const allUsers = await Users.findAll({
    where: { role: "user", campus },
    attributes: { exclude: ["password"] },
  });
  return allUsers;
};

export const updateUser = async (id, user) => {
  const userToUpdate = await Users.findOne(
    { where: { id } },
    { attributes: { exclude: ["password"] } }
  );
  if (userToUpdate) {
    await Users.update(user, { where: { id } });
    return user;
  }
  return null;
};

export const deleteUser = async (id) => {
  const userToDelete = await Users.findOne({ where: { id } });
  if (userToDelete) {
    await Users.destroy({ where: { id } });
    return userToDelete;
  }
  return null;
};

export const activateUser = async (id) => {
  const userToActivate = await Users.findOne(
    { where: { id } },
    { attributes: { exclude: ["password"] } }
  );
  if (userToActivate) {
    await Users.update({ status: "active" }, { where: { id } });
    return userToActivate;
  }
  return null;
};

export const deactivateUser = async (id) => {
  const userToDeactivate = await Users.findOne(
    { where: { id } },
    { attributes: { exclude: ["password"] } }
  );
  if (userToDeactivate) {
    await Users.update({ status: "inactive" }, { where: { id } });
    return userToDeactivate;
  }
  return null;
};

export const generateChangePasswordToken = async (user) => {
  user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordExpires = Date.now() + 24 * 3600000; // Token expires in 24 hours
  await user.save();
  return user.resetPasswordToken;
};

export const generatePasswordResetToken = async (user) => {
  user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
  await user.save();
  return user.resetPasswordToken;
};

export const isTokenValid = async (token) => {
  const user = await Users.findOne({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { [Op.gt]: Date.now() },
    },
  });
  return user;
};

export const resetPasswordService = async (user, newPassword) => {
  try {
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    return await user.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

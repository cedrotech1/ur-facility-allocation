import Email from "../utils/mailer";
import bcrypt from "bcrypt";
import {
  createUser,
  getUserByEmail,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  activateUser,
  deactivateUser,
  getUsersByCampus,
  generateChangePasswordToken,
  GetUserPassword,
  getUserByPrivilege,
} from "../services/userService";
import { checkprivileges, checkPrivilegeValidity } from "../helpers/privileges";
import imageUploader from "../helpers/imageUplouder";

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message:
        "Please provide userId, oldPassword, newPassword, and confirmPassword",
    });
  }

  try {
    const user = await GetUserPassword(req.user.id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const storedPassword = user || null;

    if (!storedPassword) {
      return res.status(500).json({
        success: false,
        message: "User password not found in the database",
      });
    }

    const validPassword = await bcrypt.compare(oldPassword, storedPassword);

    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid old password",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await updateUser(req.user.id, { password: hashedPassword });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addUser = async (req, res) => {
  if (!req.body.role || req.body.role === "") {
    return res.status(400).json({
      success: false,
      message: "Please provide role",
    });
  }

  if (req.body.role === "superadmin" && req.user.role !== "root") {
    return res.status(401).json({
      success: false,
      message: "only root allowed to add user this role",
    });
  }
  if (req.body.role === "systemcampusadmin" && req.user.role !== "superadmin") {
    return res.status(401).json({
      success: false,
      message: "only superadmin allowed to add user this role",
    });
  }
  if (req.body.role === "user" && req.user.role !== "systemcampusadmin") {
    return res.status(401).json({
      success: false,
      message: "only systemcampusadmin allowed to add user this role",
    });
  }

  if (
    req.user.role === "superadmin" &&
    (!req.body.campus || req.body.campus === "")
  ) {
    return res.status(401).json({
      success: false,
      message: "campus is required",
    });
  }
  if (!req.body.firstname || req.body.firstname === "") {
    return res.status(400).json({
      success: false,
      message: "Please provide firstname",
    });
  }
  if (!req.body.lastname || req.body.lastname === "") {
    return res.status(400).json({
      success: false,
      message: "Please provide lastname",
    });
  }
  if (!req.body.email || req.body.email === "") {
    return res.status(400).json({
      success: false,
      message: "Please provide email",
    });
  }
  if (!req.body.phone || req.body.phone === "") {
    return res.status(400).json({
      success: false,
      message: "Please provide phone",
    });
  }

  if (
    req.body.privileges &&
    checkPrivilegeValidity(req.body.privileges).length
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid privileges",
      data: { inavlidPrivileges: checkPrivilegeValidity(req.body.privileges) },
    });
  }

  if (req.user.role === "systemcampusadmin") {
    req.body.campus = req.user.campus;
  }

  try {
    const userExist = await getUserByEmail(req.body.email);
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "email already exist",
      });
    }
    // generate password
    const password = `P${Math.random().toString(36).slice(-8)}`;

    // create user with generated password and set status to active
    req.body.password = password;
    req.body.status = "active";

    const newUser = await createUser(req.body);
    const user = newUser.dataValues;
    user.password = password;

    //change password token
    const resetToken = await generateChangePasswordToken(newUser);
    const url = `${process.env.FRONTEND_URL}/auth/reset/${resetToken}`;
    // send email
    await new Email(user, url).sendAccountAdded();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser.id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        privileges: newUser.privileges,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    let users;
    if (req.user.role === "root") {
      users = await getUsers("superadmin");
    }
    if (req.user.role === "superadmin") {
      users = await getUsers("systemcampusadmin");
    }
    if (req.user.role === "systemcampusadmin") {
      users = await getUsersByCampus(req.user.campus);
    }
    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const getOneUser = async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const updateOneUser = async (req, res) => {
  try {
    if (!req.body.firstname || req.body.firstname === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide firstname",
      });
    }
    if (!req.body.lastname || req.body.lastname === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide lastname",
      });
    }

    if (!req.body.phone || req.body.phone === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide phone",
      });
    }
    if (req.files) {
      const image = await imageUploader(req);
      req.body.image = image.url;
    }
    const userExist = await getUser(req.params.id);
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const user = await updateUser(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const updateUserPrivileges = async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (req.user.role !== "HR" && req.user.role !== "admin") {
      if (
        req.user.role === "user" &&
        !checkprivileges(req.user.privileges, "manage-users")
      )
        return res.status(401).json({
          success: false,
          message: "Not authorized",
        });
    }

    if (checkPrivilegeValidity(req.body.privileges).length) {
      return res.status(400).json({
        success: false,
        message: "Invalid privileges",
        data: {
          inavlidPrivileges: checkPrivilegeValidity(req.body.privileges),
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "privileges updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const deleteOneUser = async (req, res) => {
  try {
    // if (req.user.role !== "admin" && req.user.role !== "HR") {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Not authorized",
    //   });
    // }
    const existingUser = await getUser(req.params.id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (existingUser.role === "superadmin" && req.user.role !== "root") {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    if (
      existingUser.role === "systemcampusadmin" &&
      req.user.role !== "superadmin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    if (existingUser.role === "user" && req.user.role !== "systemcampusadmin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    const user = await deleteUser(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const activateOneUser = async (req, res) => {
  try {
    const existingUser = await getUser(req.params.id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (existingUser.role === "superadmin" && req.user.role !== "root") {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    if (
      existingUser.role === "systemcampusadmin" &&
      req.user.role !== "superadmin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    if (existingUser.role === "user" && req.user.role !== "systemcampusadmin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    if (
      req.user.role !== "systemcampusadmin" &&
      existingUser.campus !== req.user.campus
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    const user = await activateUser(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User activated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const deactivateOneUser = async (req, res) => {
  try {
    const existingUser = await getUser(req.params.id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (existingUser.role === "superadmin" && req.user.role !== "root") {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    if (
      existingUser.role === "systemcampusadmin" &&
      req.user.role !== "superadmin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    if (existingUser.role === "user" && req.user.role !== "systemcampusadmin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    if (
      req.user.role !== "systemcampusadmin" &&
      existingUser.campus !== req.user.campus
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    const user = await deactivateUser(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User deactivated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const getClassRepresentatives = async (req, res) => {
  try {
    const users = await getUserByPrivilege(
      "class-representative",
      req.user.campus
    );
    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

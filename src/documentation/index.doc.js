import { name } from "ejs";
import { Router } from "express";
import { serve, setup } from "swagger-ui-express";

const docrouter = Router();

const options = {
  openapi: "3.0.1",
  info: {
    title: "Facilities Allocation API",
    version: "1.0.0",
    description: "Facilities Allocation API Documentation",
  },
  basePath: "/api",
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    { name: "Auth", description: "Auth" },
    { name: "Users", description: "Users" },
    { name: "campus", description: "campus" },
    { name: "College", description: "College" },
    { name: "school", description: "school" },
    { name: "department", description: "department" },
    { name: "program", description: "program" },
    { name: "intake", description: "intake" },
    { name: "group", description: "group" },
    { name: "Facilities", description: "Facilities" },
    { name: "booking", description: "booking" },
    { name: "notification", description: "notification" },
    { name: "Privileges", description: "Privileges" },
    { name: "modules", description: "modules" },
  ],
  paths: {
    "/api/v1/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login a user",
        description: "Login a user",
        operationId: "loginUser",
        security: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                email: "cedrotech1@gmail.com",
                password: "1234",
              },
            },
            required: true,
          },
        },
        responses: {
          200: {
            description: "User logged in successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/auth/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Forgot password",
        description: "Forgot password",
        operationId: "forgotPassword",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                email: "user@example.com",
              },
            },
            required: true,
          },
        },
        responses: {
          200: {
            description: "Password reset link sent to your email",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/auth/reset-password": {
      post: {
        tags: ["Auth"],
        summary: "Reset password",
        description: "Reset password",
        operationId: "resetPassword",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                token: "token",
                password: "newpassword",
                confirmPassword: "newpassword",
              },
            },
            required: true,
          },
        },
        responses: {
          200: {
            description: "Password reset successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/users/addUser": {
      post: {
        tags: ["Users"],
        summary: "Add a user",
        description: "Add a user",
        operationId: "addOneUser",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                firstname: "John",
                lastname: "Doe",
                email: "test@example.com",
                phone: "08012345678",
                role: "ex:[user,systemcampusadmin,superadmin]",
                campus: "1",
                college: "1",
                privileges: ["manage-booking", "manage-facilities"],
              },
            },
            required: true,
          },
        },
        responses: {
          201: {
            description: "User created successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/users/lectures": {
      get: {
        tags: ["Users"],
        summary: "Get all lecturer",
        description: "Get all lecturer",
        operationId: "getAlllecturer",
        responses: {
          200: {
            description: "User deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users",
        description: "Get all users",
        operationId: "getAllUsers",
        responses: {
          200: {
            description: "User deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get a user",
        description: "Get a user",
        operationId: "getOneUser",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "User deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/users/class-rep": {
      get: {
        tags: ["Users"],
        summary: "Get all class representatives",
        description: "Get all class representatives",
        operationId: "getClassRepresentatives",
        responses: {
          200: {
            description: "Class representatives retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Class representatives not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/users/update/{id}": {
      put: {
        tags: ["Users"],
        summary: "Update a user",
        description: "Update a user",
        operationId: "updateOneUser",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                firstname: "John",
                lastname: "Doe",
                email: "test@example.com",
                phone: "08012345678",
              },
            },
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/User",
              },
            },
          },
        },
        responses: {
          200: {
            description: "User deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/users/upload-lectures": {
      "get": {
        "tags": ["Users"],
        "summary": "Upload a file to add multiple lectures",
        "description": "Upload a CSV or Excel file to bulk add lectures",
        "operationId": "uploadlecturesFile",
        "requestBody": {
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "file": {
                    "type": "string",
                    "format": "binary",
                    "description": "CSV or Excel file containing facility data"
                  }
                },
                "required": ["file"]
              }
            }
          },
          "required": true
        },
        "responses": {
          "201": {
            "description": "lectures added successfully from file",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean"
                    },
                    "message": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad request",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean"
                    },
                    "message": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean"
                    },
                    "message": {
                      "type": "string"
                    },
                    "error": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/api/v1/users/changePassword": {
      put: {
        tags: ["Users"],
        summary: "change  user password",
        description: "change  user password  for current loged in user !! ",
        operationId: "change-passwordr",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                oldPassword: "oldp",
                newPassword: "newp",
                confirmPassword: "cpass",
              },
            },
          },
        },
        responses: {
          200: {
            description: "User password updated  successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    // Get all privileges
    "/api/v1/privileges": {
      get: {
        tags: ["Privileges"],
        summary: "Get all privileges",
        description: "Get all privileges",
        operationId: "getAllPrivileges",
        responses: {
          200: {
            description: "User deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    // update user privileges
    "/api/v1/users/updateUserPrivileges/{id}": {
      patch: {
        tags: ["Users"],
        summary: "Update user privileges",
        description: "Update user privileges",
        operationId: "updateUserPrivileges",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                privileges: ["manage-classes"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Privileges updated successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/users/delete/{id}": {
      delete: {
        tags: ["Users"],
        summary: "Delete a user",
        description: "Delete a user",
        operationId: "deleteOneUser",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "User deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/users/activate/{id}": {
      put: {
        tags: ["Users"],
        summary: "Activate a user",
        description: "Activate a user",
        operationId: "activateOneUser",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "User activated successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/users/deactivate/{id}": {
      put: {
        tags: ["Users"],
        summary: "Deactivate a user",
        description: "Deactivate a user",
        operationId: "deactivateOneUser",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "User deactivated successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/college/add": {
      post: {
        tags: ["College"],
        summary: "Add a college",
        description: "Add a college",
        operationId: "addCollege",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/College",
              },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: "College created successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/college/": {
      get: {
        tags: ["College"],
        summary: "Get all colleges",
        description: "Get all colleges",
        operationId: "allColleges",
        responses: {
          200: {
            description: "Colleges retrieved successfully",
          },
          500: {
            description: "Something went wrong",
          },
          401: {
            description: "Not authorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/college/one/{id}": {
      get: {
        tags: ["College"],
        summary: "Get a college",
        description: "Get a college",
        operationId: "getOneCollege",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "College's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "College retrieved successfully",
          },
          401: {
            description: "Not authorized",
          },
          404: {
            description: "College not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/college/{id}": {
      get: {
        tags: ["College"],
        summary: "Get a college",
        description: "Get a college",
        operationId: "getOneCollege",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "College's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "College retrieved successfully",
          },
          401: {
            description: "Not authorized",
          },
          404: {
            description: "College not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    // ... delete college endpoint
    "/api/v1/college/delete/{id}": {
      delete: {
        tags: ["College"],
        summary: "Delete a college",
        description: "Delete a college",
        operationId: "deleteOneCollege",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "College's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "College deleted successfully",
          },
          404: {
            description: "College not found",
          },
          500: {
            description: "Something went wrong",
          },
          401: {
            description: "Not authorized",
          },
        },
      },
    },
    "/api/v1/college/{id}": {
      put: {
        tags: ["College"],
        summary: "Update a college",
        description: "Update a college",
        operationId: "updateOneCollege",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "College's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/College",
              },
            },
          },
        },
        responses: {
          200: {
            description: "College updated successfully",
          },
          401: {
            description: "Not authorized",
          },
          404: {
            description: "College not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    //all campuses
    "/api/v1/campus/": {
      get: {
        tags: ["campus"],
        summary: "Get all campus",
        description: "Get all campus",
        operationId: "getcampuses",
        responses: {
          200: {
            description: "campus retrieved successfully",
          },
          401: {
            description: "Not authorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/campus/student": {
      get: {
        tags: ["campus"],
        summary: "Get all campus with colleges and schools in that college for student ",
        description: "Get all campus for student",
        operationId: "getAllcampus_student",
        responses: {
          200: {
            description: "campus retrieved successfully",
          },
          401: {
            description: "Not authorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    
    "/api/v1/campus/all": {
      get: {
        tags: ["campus"],
        summary: "Get all campus with colleges and schools in that college ",
        description: "Get all campus",
        operationId: "getAllcampus",
        responses: {
          200: {
            description: "campus retrieved successfully",
          },
          401: {
            description: "Not authorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/campus/{id}": {
      get: {
        tags: ["campus"],
        summary: "Get one campus with colleges and schools in that college ",
        description: "Get one campus",
        operationId: "getonecampus",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "campus id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "campus retrieved successfully",
          },
          401: {
            description: "Not authorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/campus/delete/{id}": {
      delete: {
        tags: ["campus"],
        summary: "delete campus",
        description: "delete campus",
        operationId: "delete_campus",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "campus id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "campus retrieved successfully",
          },
          401: {
            description: "Not authorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/campus/add/": {
      post: {
        tags: ["campus"],
        summary: "Add a campus",
        description: "Add a campus",
        operationId: "addcampus",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/campus",
              },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: "campus created successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Not authorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/campus/{id}": {
      put: {
        tags: ["campus"],
        summary: "Update a campus",
        description: "Update a campus",
        operationId: "editcampus",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "campus's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/campus",
              },
            },
          },
        },
        responses: {
          200: {
            description: "campus updated successfully",
          },
          401: {
            description: "Not authorized",
          },
          404: {
            description: "campus not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/campus/one/{id}": {
      get: {
        tags: ["campus"],
        summary: "Get one campus",
        description: "one all campus",
        operationId: "onecampus",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "campus id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "campus retrieved successfully",
          },
          401: {
            description: "Not authorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    // SCHOOL ENDPOINT START

    "/api/v1/school/": {
      post: {
        tags: ["school"],
        summary: "Add a school",
        description: "Add a school",
        operationId: "addschool",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/School",
              },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: " created successfully",
          },
          201: {
            description: "School created successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/school/all": {
      get: {
        tags: ["school"],
        summary: "get a schools",
        description: "get a schools",
        operationId: "get_schools",

        responses: {
          200: {
            description: "School retrieved successfully",
          },
          201: {
            description: "School retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/school/{id}": {
      get: {
        tags: ["school"],
        summary: "get one schools",
        description: "get one  school",
        operationId: "getschool",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "school id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          201: {
            description: "School retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/school/delete/{id}": {
      delete: {
        tags: ["school"],
        summary: "delete one schools",
        description: "delete one  school",
        operationId: "delete_school",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "school id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          201: {
            description: "School deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/school/edit/{id}": {
      put: {
        tags: ["school"],
        summary: "edit a school",
        description: "edit a school",
        operationId: "editschool",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "campus's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/School",
              },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: "School edited successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
          404: {
            description: "not found",
          },
        },
      },
    },
    "/api/v1/facilities/add": {
      post: {
        tags: ["Facilities"],
        summary: "Add a facility",
        description: "Add a facility",
        operationId: "addfacility",
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/Facility",
              },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: "Facility created successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/facilities/upload-facilities": {
  "get": {
    "tags": ["Facilities"],
    "summary": "Upload a file to add multiple facilities",
    "description": "Upload a CSV or Excel file to bulk add facilities with campus_id automatically set to the authenticated user's campus",
    "operationId": "uploadFacilitiesFile",
    "requestBody": {
      "content": {
        "multipart/form-data": {
          "schema": {
            "type": "object",
            "properties": {
              "file": {
                "type": "string",
                "format": "binary",
                "description": "CSV or Excel file containing facility data"
              }
            },
            "required": ["file"]
          }
        }
      },
      "required": true
    },
    "responses": {
      "201": {
        "description": "Facilities added successfully from file",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "success": {
                  "type": "boolean"
                },
                "message": {
                  "type": "string"
                }
              }
            }
          }
        }
      },
      "400": {
        "description": "Bad request",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "success": {
                  "type": "boolean"
                },
                "message": {
                  "type": "string"
                }
              }
            }
          }
        }
      },
      "500": {
        "description": "Internal server error",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "success": {
                  "type": "boolean"
                },
                "message": {
                  "type": "string"
                },
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    }
  }
},

    "/api/v1/facilities": {
      get: {
        tags: ["Facilities"],
        summary: "get a facilities",
        description: "get a facilities",
        operationId: "get_facilities",

        responses: {
          200: {
            description: "facilities retrieved successfully",
          },
          201: {
            description: "facilities retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/facilities/withDefaultGroups": {
      get: {
        tags: ["Facilities"],
        summary: "get facilities with default groups",
        description: "get  facilities with default groups",
        operationId: "get_facilities_with_default_groups",
        responses: {
          200: {
            description: "facilities retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/facilities/withDefaultGroupsForStudent": {
      get: {
        tags: ["Facilities"],
        summary: "get facilities with default groups ForStudent",
        description: "get  facilities with default groups ForStudent",
        operationId: "timetable_ForStudent",
        responses: {
          200: {
            description: "facilities retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/facilities/withDefaultGroupsByDean": {
      get: {
        tags: ["Facilities"],
        summary: "get facilities with default groups by dean",
        description: "get  facilities with default groups by dean",
        operationId: "for_dean",
        responses: {
          200: {
            description: "facilities retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/facilities/one/{id}": {
      get: {
        tags: ["Facilities"],
        summary: "get one facility",
        description: "get one  facility",
        operationId: "getfacility",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "facility id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          201: {
            description: "facility retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/facilities/disactivated": {
      get: {
        tags: ["Facilities"],
        summary: "get a disactivated facilities",
        description: "get a disactivated facilities",
        operationId: "get_disactivated_facilities",

        responses: {
          200: {
            description: "disactivated facilities retrieved successfully",
          },
          201: {
            description: "facilities retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/facilities/activated": {
      get: {
        tags: ["Facilities"],
        summary: "get a activated facilities",
        description: "get a activated facilities",
        operationId: "get_activated_facilities",

        responses: {
          200: {
            description: "activated facilities retrieved successfully",
          },
          201: {
            description: "facilities retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/facilities/delete/{id}": {

      delete: {
        tags: ["Facilities"],
        summary: "delete one facility",
        description: "delete one  facility",
        operationId: "delete_facility",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "facility id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          201: {
            description: "Facility deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/facilities/edit/{id}": {
      put: {
        tags: ["Facilities"],
        summary: "edit a facility",
        description: "edit a facility",
        operationId: "editfacility",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "campus's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/Facility",
              },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: "Facility edited successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
          404: {
            description: "not found",
          },
        },
      },
    },
    "/api/v1/facilities/{id}/assign": {
      put: {
        tags: ["Facilities"],
        summary: "assign a default groups on a facility",
        description: "assign a facility",
        operationId: "assignfacility",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "facility's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Facility",
              },
              example: {

                  "groups": [
                    1,
                    2
                  ],
                  "times": [
                    {
                      "day": "Monday",
                      "timeInterval": "7:00 am - 12:00 am"
                    },
                    {
                      "day": "Wednesday",
                      "timeInterval": "2:00 pm - 17:00 am"
                    },
                    {
                      "day": "Friday",
                      "timeInterval": "7:00 am - 12:00 am"
                    }
                  ],
                  "trimester": "trimester 1",
                  "module": "Module Name",
                  "lecturer": "Lecturer Name",
                  "sendEmail": false
                
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "Facility assigned successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
          404: {
            description: "not found",
          },
        },
      },
    },

    "/api/v1/facilities/default-groups/{id}/time": {
      put: {
        tags: ["Facilities"],
        summary: "edit a facility",
        description: "edit a facility",
        operationId: "edittimefacility",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "default group 's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        requestBody: {
          content: {
            "application/json": {
              example: {         
                    "day": "Friday",
                    "timeInterval": "full day"
            },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: "Facility edited successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
          404: {
            description: "not found",
          },
        },
      },
    },
    "/api/v1/facilities/delete/times/{id}": {
      delete: {
        tags: ["Facilities"],
        summary: "delete time on frame",
        description: "delete time frame",
        operationId: "delete_time_group",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "time model's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

    
        responses: {
          201: {
            description: "Facility edited successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
          404: {
            description: "not found",
          },
        },
      },
    },
    "/api/v1/facilities/{id}/defaultgroup/addgroup": {
      put: {
        tags: ["Facilities"],
        summary: "add group/s to assigned a default groups on a facility",
        description: "add group/s to assigned a default groups on a facility",
        operationId: "updategroups",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "default group 's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Facility",
              },
              example: {
                
                  "groups": [
                    1,
                    2
                  ],
                              
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "Facility assigned successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
          404: {
            description: "not found",
          },
        },
      },
    },
    "/api/v1/facilities/{id}/unassign": {
      put: {
        tags: ["Facilities"],
        summary: "unassign one default group a facility",
        description: "unassign a facility",
        operationId: "unassignfacility",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "facility's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Facility",
              },
              example: {
                groupId: "1",
                defaultGroupId:"1"
              },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: "Facility unassigned successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
          404: {
            description: "not found",
          },
        },
      },
    },
    "/api/v1/facilities/{id}/unassign/all": {
      put: {
        tags: ["Facilities"],
        summary: "unassign all defaults on a facility",
        description: "unassign all defaults on a facility",
        operationId: "unassignfacilityall",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "facility's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Facility unassigned successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
          404: {
            description: "not found",
          },
        },
      },
    },
    "/api/v1/facilities/timetable": {
      get: {
        tags: ["Facilities"],
        summary: "get a DefaultGroups with facilities and times",
        description: "get a DefaultGroups",
        operationId: "DefaultGroups",

        responses: {
          200: {
            description: "DefaultGroups retrieved successfully",
          },
          201: {
            description: "facilities retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/facilities/defaultGroups/activate/{id}": {
      put: {
        tags: ["Facilities"],
        summary: "activate defout group",
        description: "Activate a  defout group",
        operationId: "active",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "default group 's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "User activated successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/facilities/defaultGroups/deactivate/{id}": {
      put: {
        tags: ["Facilities"],
        summary: "Disactivate defout group",
        description: "Activatate  defout groupr",
        operationId: "Disactivate",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "default group 's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "User activated successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/modules/upload-modules": {
      "get": {
        "tags": ["modules"],
        "summary": "Upload a file to add multiple modules",
        "description": "Upload a CSV or Excel file to bulk add facilities",
        "operationId": "uploadModuleFile",
        "requestBody": {
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "file": {
                    "type": "string",
                    "format": "binary",
                    "description": "CSV or Excel file containing facility data"
                  }
                },
                "required": ["file"]
              }
            }
          },
          "required": true
        },
        "responses": {
          "201": {
            "description": "Facilities added successfully from file",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean"
                    },
                    "message": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad request",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean"
                    },
                    "message": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean"
                    },
                    "message": {
                      "type": "string"
                    },
                    "error": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },

    "/api/v1/modules": {
      get: {
        tags: ["modules"],
        summary: "get a modules",
        description: "get a modules",
        operationId: "get modules",

        responses: {
          200: {
            description: "modules retrieved successfully",
          },
          201: {
            description: "modules retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/modules/{id}": {
      put: {
        tags: ["modules"],
        summary: "get a modules",
        description: "get a modules",
        operationId: "get modules",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "module's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Module",
              },
              example: {
                majorArea: "Computer Science",
                subjectCode: "CS101",
                subjectName: "Introduction to Computer Science",
                yearOfStudy: 1,
                blocks: "Block A, Block B",
                credits: 3,
                majorElective: "Major",
                programID: 1
              }
            },
          },
          required: true,
        },

        responses: {
          200: {
            description: "modules retrieved successfully",
          },
          201: {
            description: "modules retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/modules/delete/{id}": {
      delete: {
        tags: ["modules"],
        summary: "get a delete modules",
        description: "delete a modules",
        operationId: "delete_modules",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "module's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
     
        responses: {
          200: {
            description: "modules retrieved successfully",
          },
          201: {
            description: "modules retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    //DEPARTMENT STAFFS  department

    "/api/v1/department/add": {
      post: {
        tags: ["department"],
        summary: "Add a department",
        description: "Add a department",
        operationId: "add_department",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/department",
              },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: "department created successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/department/": {
      get: {
        tags: ["department"],
        summary: "get all departments",
        description: "get all departments in the system",
        operationId: "get_department",
        responses: {
          201: {
            description: "department retieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/department/one/{id}": {
      get: {
        tags: ["department"],
        summary: "get one departments",
        description: "get one departments in the system",
        operationId: "getonedepartment",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "department's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          201: {
            description: "department retieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/department/delete/{id}": {
      delete: {
        tags: ["department"],
        summary: "delete one departments",
        description: "delete one departments in the system",
        operationId: "delete",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "department's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          201: {
            description: "department deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/department/{id}": {
      put: {
        tags: ["department"],
        summary: "update a department",
        description: "update a department",
        operationId: "update_department",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "department's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/department",
              },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: "department updated successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/facilities/booked": {
      get: {
        tags: ["Facilities"],
        summary: "get booked facilities",
        description: "get booked facilities",
        operationId: "get_booked_facilities",

        responses: {
          200: {
            description: "Facility retrieved successfully",
          },
          201: {
            description: "Facility retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/program/delete/{id}": {
      delete: {
        tags: ["program"],
        summary: "delete one program",
        description: "delete one program in the system",
        operationId: "delete",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "program's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          201: {
            description: "program deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/program/one/{id}": {
      get: {
        tags: ["program"],
        summary: "get one program",
        description: "get one program in the system",
        operationId: "oneprogram",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "program's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          201: {
            description: "program retieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/program/": {
      get: {
        tags: ["program"],
        summary: "get all program",
        description: "get all program in the system",
        operationId: "get_programs",

        responses: {
          201: {
            description: "program retieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/program/modules": {
      get: {
        tags: ["program"],
        summary: "get all program",
        description: "get all program with their coresponding modules in the system",
        operationId: "get_programs_with_modules",

        responses: {
          201: {
            description: "program retieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/program/{id}": {
      put: {
        tags: ["program"],
        summary: "update a program",
        description: "update a program",
        operationId: "update_program",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "program's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/program",
              },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: "program updated successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/program/add": {
      post: {
        tags: ["program"],
        summary: "Add a program",
        description: "Add a program",
        operationId: "add_program",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/program",
              },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: "program created successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/intake/": {
      get: {
        tags: ["intake"],
        summary: "get all intake",
        description: "get all intake in the system",
        operationId: "get_intake",

        responses: {
          201: {
            description: "intake retieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "intake not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
      post: {
        tags: ["intake"],
        summary: "Add a intake",
        description: "Add a intake",
        operationId: "add_intake",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/intake",
              },
              example: {
                Year: "2021",
                Month: "January",
                program_ID: "1",
                size: "100",
              },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: "intake created successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },

          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/intake/{id}": {
      get: {
        tags: ["intake"],
        summary: "get one intake",
        description: "get one intake in the system",
        operationId: "getoneintake",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "intake's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          201: {
            description: "intake retieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },

          500: {
            description: "Something went wrong",
          },
        },
      },
      put: {
        tags: ["intake"],
        summary: "update a intake",
        description: "update a intake",
        operationId: "update_intake",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "intake's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/intake",
              },
              example: {
                startYear: "2021",
                startMonth: "January",
                endYear: "2022",
                endMonth: "December",
                program_ID: "1",
                size: "100",
              },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: "intake updated successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },

          500: {
            description: "Something went wrong",
          },
        },
      },
      delete: {
        tags: ["intake"],
        summary: "delete one intake",
        description: "delete one intake in the system",
        operationId: "delete",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "intake's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          201: {
            description: "intake deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },

          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/intake/program/{id}": {
      get: {
        tags: ["intake"],
        summary: "get intake by program",
        description: "get intake by program in the system",
        operationId: "getprogramintake",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "intake's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          201: {
            description: "intake retieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },

          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/intake/{year}/program/{id}/": {
      get: {
        tags: ["intake"],
        summary: "get intake by program and intake's year",
        description: "get intake by program in the system",
        operationId: "getprogramintake",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "program's id",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "year",
            in: "path",
            description: "intake's year",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          201: {
            description: "intake retieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },

          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/group/": {
      get: {
        tags: ["group"],
        summary: "get all intake",
        description: "get all group in the system",
        operationId: "get_group",

        responses: {
          201: {
            description: "group retieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "group not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/group/add": {
      post: {
        tags: ["group"],
        summary: "Add a group",
        description: "Add a group",
        operationId: "add_group",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/group",
              },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: "group created successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/group/{id}": {
      put: {
        tags: ["group"],
        summary: "update a group",
        description: "update a group",
        operationId: "update_group",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "group's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/group",
              },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: "group updated successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/group/delete/{id}": {
      delete: {
        tags: ["group"],
        summary: "delete one group",
        description: "delete one group in the system",
        operationId: "delete",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "group's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          201: {
            description: "group deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/group/one/{id}": {
      get: {
        tags: ["group"],
        summary: "get one group",
        description: "get one group in the system",
        operationId: "onegroup",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "group's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          201: {
            description: "group retieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/booking/": {
      get: {
        tags: ["booking"],
        summary: "Get all booking",
        description: "Get all booking",
        operationId: "allbooking",
        responses: {
          200: {
            description: "booking retrieved successfully",
          },
          500: {
            description: "Something went wrong",
          },
          401: {
            description: "Not authorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/booking/managers": {
      get: {
        tags: ["booking"],
        summary: "Get all lab managers",
        description: "Get all managers",
        operationId: "allmanagers",
        responses: {
          200: {
            description: "managers retrieved successfully",
          },
          500: {
            description: "Something went wrong",
          },
          401: {
            description: "Not authorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/booking/technitians": {
      get: {
        tags: ["booking"],
        summary: "Get all lab technitians",
        description: "Get all technitians",
        operationId: "alltechnitians",
        responses: {
          200: {
            description: "technitians retrieved successfully",
          },
          500: {
            description: "Something went wrong",
          },
          401: {
            description: "Not authorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/booking/schooldean": {
      get: {
        tags: ["booking"],
        summary: "Get all lab schooldean",
        description: "Get all schooldean",
        operationId: "allschooldean",
        responses: {
          200: {
            description: "technitians retrieved successfully",
          },
          500: {
            description: "Something went wrong",
          },
          401: {
            description: "Not authorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/booking/rejected": {
      get: {
        tags: ["booking"],
        summary: "Get all rejected bookings",
        description: "Get all rejected booking",
        operationId: "rejected",
        responses: {
          200: {
            description: "rejected booking retrieved successfully",
          },
          500: {
            description: "Something went wrong",
          },
          401: {
            description: "Not authorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/booking/approved": {
      get: {
        tags: ["booking"],
        summary: "Get all approved bookings",
        description: "Get all approved booking",
        operationId: "approved",
        responses: {
          200: {
            description: "approved booking retrieved successfully",
          },
          500: {
            description: "Something went wrong",
          },
          401: {
            description: "Not authorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/booking/pending": {
      get: {
        tags: ["booking"],
        summary: "Get all pending bookings",
        description: "Get all pending booking",
        operationId: "pending",
        responses: {
          200: {
            description: "pending booking retrieved successfully",
          },
          500: {
            description: "Something went wrong",
          },
          401: {
            description: "Not authorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/booking/prepending": {
      get: {
        tags: ["booking"],
        summary: "Get all prepending bookings",
        description: "Get all prepending booking",
        operationId: "prepending",
        responses: {
          200: {
            description: "prepending booking retrieved successfully",
          },
          500: {
            description: "Something went wrong",
          },
          401: {
            description: "Not authorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/booking/facilities/{id}": {
      get: {
        tags: ["booking"],
        summary: "Get facility booking",
        description: "Get facility booking by facility Id",
        operationId: "facilityBookings",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "facility's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "booking retrieved successfully",
          },
          500: {
            description: "Something went wrong",
          },
          401: {
            description: "Not authorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/booking/facility/{id}/report": {
      get: {
        tags: ["booking"],
        summary: "Get report facility booking",
        description: "Get facility report booking by facility Id",
        operationId: "facilityBookingsreport",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "facility's id",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "startDate",
            in: "query",
            description: "Start date for the booking period (YYYY-MM-DD)",
            required: true,
            schema: {
              type: "string",
              format: "date",
            },
          },
          {
            name: "endDate",
            in: "query",
            description: "End date for the booking period (YYYY-MM-DD)",
            required: true,
            schema: {
              type: "string",
              format: "date",
            },
          },
        ],
        responses: {
          200: {
            description: "Booking retrieved successfully",
          },
          401: {
            description: "Not authorized",
          },
          404: {
            description: "No bookings found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/booking/facilitiesReport": {
      get: {
        tags: ["booking"],
        summary: "Get report of facility bookings",
        description:
          "Get report of bookings across all facilities within a specified period",
        operationId: "facilitiesBookingsReport",
        parameters: [
          {
            name: "startDate",
            in: "query",
            description: "Start date for the booking period (YYYY-MM-DD)",
            required: true,
            schema: {
              type: "string",
              format: "date",
            },
          },
          {
            name: "endDate",
            in: "query",
            description: "End date for the booking period (YYYY-MM-DD)",
            required: true,
            schema: {
              type: "string",
              format: "date",
            },
          },
        ],
        responses: {
          200: {
            description: "Booking report retrieved successfully",
          },
          401: {
            description: "Not authorized",
          },
          404: {
            description: "No bookings found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/booking/add": {
      post: {
        tags: ["booking"],
        summary: "Add a booking",
        description: "Add a booking",
        operationId: "addbooking",
        requestBody: {
          content: {
            "application/json": {
              example: {
                facility: "1",
                groups: [1],
                startPeriod: "2024-02-29T07:30:00.000Z",
                endPeriod: "2024-02-29T10:45:00.000Z",
              },
            },
          },
        },
        responses: {
          201: {
            description: "booking created successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/booking/one/{id}": {
      get: {
        tags: ["booking"],
        summary: "Get one booking",
        description: "Get one booking",
        operationId: "onebooking",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "booking's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "booking retrieved successfully",
          },
          500: {
            description: "Something went wrong",
          },
          401: {
            description: "Not authorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/booking/one/prepending/{id}": {
      get: {
        tags: ["booking"],
        summary: "Get one prebooking",
        description: "Get one pre-pending booking",
        operationId: "oneprebooking",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "booking's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "booking retrieved successfully",
          },
          500: {
            description: "Something went wrong",
          },
          401: {
            description: "Not authorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/booking/cancel/{id}": {
      delete: {
        tags: ["booking"],
        summary: "Cancel a booking",
        description: "Cancel a booking",
        operationId: "cancelOnebooking",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "booking's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "booking canceled successfully",
          },
          404: {
            description: "booking not found",
          },
          500: {
            description: "Something went wrong",
          },
          401: {
            description: "Not authorized",
          },
        },
      },
    },
    "/api/v1/booking/rejected/{id}": {
      delete: {
        tags: ["booking"],
        summary: "delete rejected request a booking",
        description: "delete rejected request a booking",
        operationId: "deleteRejected",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "booking's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "booking canceled successfully",
          },
          404: {
            description: "booking not found",
          },
          500: {
            description: "Something went wrong",
          },
          401: {
            description: "Not authorized",
          },
        },
      },
    },

    "/api/v1/booking/{id}": {
      put: {
        tags: ["booking"],
        summary: "update a booking",
        description: "update a booking",
        operationId: "updatebooking",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "booking's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              example: {
                class: "2",
                groups: "newp",
                startPeriod: "1/2/2024",
                endPeriod: "1/2/2024",
                date: "",
              },
            },
          },
        },
        responses: {
          201: {
            description: "booking created successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/booking/approve/{id}": {
      put: {
        tags: ["booking"],
        summary: "Approving a booking",
        description: "Approving a booking",
        operationId: "Approvingbooking",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "booking's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "booking Approved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/booking/reject/{id}": {
      put: {
        tags: ["booking"],
        summary: "Rejecting a booking",
        description: "Rejecting a booking",
        operationId: "Rejectingbooking",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "booking's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              example: {
                reason_to_reject: "class will be repared !",
              },
            },
          },
        },
        responses: {
          200: {
            description: "booking Rejected successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/booking/approveViaEmail/{token}": {
      put: {
        tags: ["booking"],
        summary: "Approve a booking via email",
        description: "Approve a booking via email",
        operationId: "ApprovingBookingViaEmail",
        parameters: [
          {
            name: "token",
            in: "path",
            description: "approve's token",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "booking Approved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/booking/rejectViaEmail/{token}": {
      put: {
        tags: ["booking"],
        summary: "Reject a booking via email",
        description: "Reject a booking via email",
        operationId: "RejectingBookingViaEmail",
        parameters: [
          {
            name: "token",
            in: "path",
            description: "reject's token",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              example: {
                reason_to_reject: "class will be repared !",
              },
            },
          },
        },
        responses: {
          200: {
            description: "booking Rejected successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/notifications/": {
      get: {
        tags: ["notification"],
        summary: "Get all notifications",
        description: "Get all notifications",
        operationId: "allnotifications",
        responses: {
          200: {
            description: "notifications retrieved successfully",
          },
          500: {
            description: "Something went wrong",
          },
          401: {
            description: "Not authorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/notifications/{id}": {
      get: {
        tags: ["notification"],
        summary: "Get one notification",
        description: "Get one notification",
        operationId: "onenotification",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "notification's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "notification retrieved successfully",
          },
          500: {
            description: "Something went wrong",
          },
          401: {
            description: "Not authorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/notifications/unreaded": {
      get: {
        tags: ["notification"],
        summary: "Get all unreaded notifications",
        description: "Get all unreaded notifications",
        operationId: "unreadednotifications",
        responses: {
          200: {
            description: "notifications retrieved successfully",
          },
          500: {
            description: "Something went wrong",
          },
          401: {
            description: "Not authorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/notifications/delete/{id}": {
      delete: {
        tags: ["notification"],
        summary: "Delete a notification",
        description: "Delete a notification",
        operationId: "deleteOneNotification",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "notification's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "notification deleted successfully",
          },
          404: {
            description: "notification not found",
          },
          500: {
            description: "Something went wrong",
          },
          401: {
            description: "Not authorized",
          },
        },
      },
    },
    "api/v1/notifications/deleteAll": {
      delete: {
        tags: ["notification"],
        summary: "Delete all notifications",
        description: "Delete all notifications",
        operationId: "deleteAllNotifications",
        responses: {
          200: {
            description: "notifications deleted successfully",
          },
          404: {
            description: "notification not found",
          },
          500: {
            description: "Something went wrong",
          },
          401: {
            description: "Not authorized",
          },
        },
      },
    },
    "/api/v1/notifications/markAsRead/{id}": {
      put: {
        tags: ["notification"],
        summary: "Mark a notification as read",
        description: "Mark a notification as read",
        operationId: "markAsRead",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "notification's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "notification marked as read successfully",
          },
          404: {
            description: "notification not found",
          },
          500: {
            description: "Something went wrong",
          },
          401: {
            description: "Not authorized",
          },
        },
      },
    },
    "/api/v1/notifications/markAllAsRead": {
      put: {
        tags: ["notification"],
        summary: "Mark all notifications as read",
        description: "Mark all notifications as read",
        operationId: "markAllAsRead",
        responses: {
          200: {
            description: "notifications marked as read successfully",
          },
          404: {
            description: "notification not found",
          },
          500: {
            description: "Something went wrong",
          },
          401: {
            description: "Not authorized",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          firstname: {
            type: "string",
            description: "User's firstname",
          },
          lastname: {
            type: "string",
            description: "User's lastname",
          },
          gender: {
            type: "string",
            description: "User's gender",
          },
          dob: {
            type: "string",
            description: "User's date of birth",
          },
          address: {
            type: "string",
            description: "User's address",
          },
          phone: {
            type: "string",
            description: "User's phone number",
          },
          image: {
            type: "string",
            description: "User's profile image",
            format: "binary",
          },
        },
      },
      campus: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "College's name",
          },

          // ... (other college properties)
        },
      },
      College: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "College's name",
          },
          campus_id: {
            type: "string",
            description: "campus id",
          },
          abbreviation: {
            type: "string",
            description: "College abbreviation",
          },
          // ... (other college properties)
        },
      },
      department: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "College's name",
          },
          school_ID: {
            type: "string",
            description: "school's id",
          },
          // ... (other college properties)
        },
      },
      program: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "program's name",
          },
          description: {
            type: "string",
            description: "program's description",
          },
          department_ID: {
            type: "string",
            description: "department's id",
          },
          // ... (other college properties)
        },
      },
      School: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "school's name",
          },

          college_ID: {
            type: "string",
            description: "college id",
          },
          dean: {
            type: "string",
            description: "dean id",
          },
        },
      },
      Module: {
        type: "object",
        properties: {
          majorArea: {
            type: "string",
            description: "The major area of study the module belongs to."
          },
          subjectCode: {
            type: "string",
            description: "The unique code of the subject associated with the module."
          },
          subjectName: {
            type: "string",
            description: "The name of the subject/module."
          },
          yearOfStudy: {
            type: "integer",
            description: "The year of study the module is part of (e.g., Year 1, Year 2)."
          },
          blocks: {
            type: "string",
            description: "The blocks or periods in which the module is taught."
          },
          credits: {
            type: "integer",
            description: "The number of credits associated with the module."
          },
          majorElective: {
            type: "string",
            description: "Indicates whether the module is a major or an elective module."
          },
          programID: {
            type: "integer",
            description: "The ID of the program to which the module belongs."
          }
        }
      },
      Facility: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "facility's name",
          },
          category: {
            type: "string",
            description: "facility's category",
          },
          location: {
            type: "string",
            description: "facility location",
          },
          size: {
            type: "string",
            description: "facility size",
          },
          materials: {
            type: "array",
            description: "facility material",
          },
          status: {
            type: "string",
            description: "facility status (active/inactive)",
          },
          managerId: {
            type: "string",
            description: "facility manager",
          },
          technicianId: {
            type: "string",
            description: "facility technicianId",
          },
        },
      },
      intake: {
        type: "object",
        properties: {
          Year: {
            type: "string",
            description: "intake year",
          },
          Month: {
            type: "string",
            description: "intake month",
          },
          
          program_ID: {
            type: "string",
            description: "program's id",
          },
          size: {
            type: "string",
            description: "intake size",
          },
          // ... (other  properties)
        },
      },
      group: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "group 's name",
          },

          intake_id: {
            type: "string",
            description: "intake id",
          },
          size: {
            type: "string",
            description: "intake id",
          },

          representative: {
            type: "string",
            description: "class representative id",
          },
        },
      },
    },

    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

docrouter.use("/", serve, setup(options));

export default docrouter;

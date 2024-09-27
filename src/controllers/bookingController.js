import {
  createBooking,
  updateBooking,
  getBookings,
  getOneBookingWithDetails,
  approvebookings,
  rejectingbookings,
  getBookingsByFacility,
  cancelBooking,
  getRejectedBookings,
  getApprovedBookings,
  getPendingBookings,
  prependingbookings,
  approveTOpendingbookings,
  getprePendingBookings,
  getOnepreBookingWithDetails,
  
} from "../services/bookingService";
import { getOneSchoolWithDetails } from "../services/schoolService";
import { getOneFacility } from "../services/facilityService.js";
import { getUser } from "../services/userService";
import Email from "../utils/mailer";
import { checkprivileges } from "../helpers/privileges";
import {
  getUserByPrivilege,
  getUserByPrivilegeForLab,
} from "../services/userService";
import {
  generateApprovalToken,
  checkApprovalToken,
} from "../helpers/approvalToken";
import { addNotification } from "../services/notificationService.js";
import e from "cors";

export const BookingWithAll = async (req, res) => {
  try {
    const userid = req.user.id;
    let data = await getBookings();
    if (!data) {
      data = [];
      return res.status(404).json({
        message: "Booking not found",
        data,
      });
    }

    data = data.filter((data) => data.User.id === userid);

    return res.status(200).json({
      success: true,
      message: "Booking retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const Bookingrejected = async (req, res) => {
  try {
    let data = await getRejectedBookings();
    const campusid = req.user.campus;
    if (!data) {
      data = [];
      return res.status(404).json({
        message: "Rejected Booking not found",
        data,
      });
    }

    if (
      checkprivileges(req.user.privileges, "manage-lab-approval") &&
      !checkprivileges(req.user.privileges, "manage-facility-approval")
    ) {
      data = data.filter(
        (data) =>
          (data.Facility.campus_id === campusid &&
            data.Facility.managerId == req.user.id &&
            data.Facility.category == "computerLab" &&
            data.Facility.category != "classRoom") ||
          data.Facility.category == "medicineLab"
      );
    }

    if (
      checkprivileges(req.user.privileges, "manage-lab-approval") &&
      checkprivileges(req.user.privileges, "manage-facility-approval")
    ) {
      data = data.filter(
        (data) =>
          (data.Facility.campus_id === campusid &&
            (data.Facility.category == "computerLab" ||
              data.Facility.category == "medicineLab") &&
            data.Facility.managerId == req.user.id) ||
          data.Facility.category == "classRoom"
      );
    }

    if (
      !checkprivileges(req.user.privileges, "manage-lab-approval") &&
      checkprivileges(req.user.privileges, "manage-facility-approval")
    ) {
      data = data.filter(
        (data) =>
          data.Facility.campus_id === campusid &&
          data.Facility.category == "classRoom"
      );
    }

    return res.status(200).json({
      success: true,
      message: "Booking retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};
export const Bookingapproved = async (req, res) => {
  try {
    let data = await getApprovedBookings();
    const campusid = req.user.campus;
    if (!data) {
      data = [];
      return res.status(404).json({
        message: "Approved Booking not found",
        data,
      });
    }

    if (
      checkprivileges(req.user.privileges, "manage-lab-approval") &&
      !checkprivileges(req.user.privileges, "manage-facility-approval")
    ) {
      data = data.filter(
        (data) =>
          (data.Facility.campus_id === campusid &&
            data.Facility.managerId == req.user.id &&
            data.Facility.category == "computerLab" &&
            data.Facility.category != "classRoom") ||
          data.Facility.category == "medicineLab"
      );
    }

    if (
      checkprivileges(req.user.privileges, "manage-lab-approval") &&
      checkprivileges(req.user.privileges, "manage-facility-approval")
    ) {
      data = data.filter(
        (data) =>
          (data.Facility.campus_id === campusid &&
            (data.Facility.category == "computerLab" ||
              data.Facility.category == "medicineLab") &&
            data.Facility.managerId == req.user.id) ||
          data.Facility.category == "classRoom"
      );
    }

    if (
      !checkprivileges(req.user.privileges, "manage-lab-approval") &&
      checkprivileges(req.user.privileges, "manage-facility-approval")
    ) {
      data = data.filter(
        (data) =>
          data.Facility.campus_id === campusid &&
          data.Facility.category == "classRoom"
      );
    }
    return res.status(200).json({
      success: true,
      message: "Approved Booking retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};
export const Bookingpending = async (req, res) => {
  try {
    let data = await getPendingBookings();
    const campusid = req.user.campus;
    if (!data) {
      data = [];
      return res.status(404).json({
        message: "Pending Booking not found",
        data,
      });
    }

    if (
      checkprivileges(req.user.privileges, "manage-lab-approval") &&
      !checkprivileges(req.user.privileges, "manage-facility-approval")
    ) {
      data = data.filter((data) => {
        return (
          data.Facility.campus_id === campusid &&
          data.Facility.managerId == req.user.id &&
          data.Facility.category === "computerLab" &&
          data.Facility.category !== "classRoom"
        ) || data.Facility.category === "medicineLab";
      });
      
    }

    if (
      checkprivileges(req.user.privileges, "manage-lab-approval") &&
      checkprivileges(req.user.privileges, "manage-facility-approval")
    ) {
      data = data.filter(
        (data) =>
          (data.Facility.campus_id === campusid &&
            (data.Facility.category == "computerLab" ||
              data.Facility.category == "medicineLab") &&
            data.Facility.managerId == req.user.id) ||
          data.Facility.category == "classRoom"
      );
    }

    if (
      !checkprivileges(req.user.privileges, "manage-lab-approval") &&
      checkprivileges(req.user.privileges, "manage-facility-approval")
    ) {
      data = data.filter(
        (data) =>
          data.Facility.campus_id === campusid &&
          data.Facility.category == "classRoom"
      );
    }

    return res.status(200).json({
      success: true,
      message: "pending Booking retrieved successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};
export const pregpending = async (req, res) => {
  try {
    let data = await getprePendingBookings();
    const campusid = req.user.campus;
    if (!data) {
      data = [];
      return res.status(404).json({
        message: "Pre Pending Booking not found",
        data,
      });
    }

    if (
      checkprivileges(req.user.privileges, "manage-lab-approval") &&
      !checkprivileges(req.user.privileges, "manage-facility-approval")
    ) {
      data = data.filter(
        (data) =>
          (data.Facility.campus_id === campusid &&
            data.Facility.managerId == req.user.id &&
            data.Facility.category == "computerLab" &&
            data.Facility.category != "classRoom") ||
          data.Facility.category == "medicineLab"
      );
    }

    if (
      checkprivileges(req.user.privileges, "manage-lab-approval") &&
      checkprivileges(req.user.privileges, "manage-facility-approval")
    ) {
      data = data.filter(
        (data) =>
          (data.Facility.campus_id === campusid &&
            (data.Facility.category == "computerLab" ||
              data.Facility.category == "medicineLab") &&
            data.Facility.managerId == req.user.id) ||
          data.Facility.category == "classRoom"
      );
    }

    if (
      !checkprivileges(req.user.privileges, "manage-lab-approval") &&
      checkprivileges(req.user.privileges, "manage-facility-approval")
    ) {
      data = data.filter(
        (data) =>
          data.Facility.campus_id === campusid &&
          data.Facility.category == "classRoom"
      );
    }

    return res.status(200).json({
      success: true,
      message: "pending Booking retrieved successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};
export const getFacilityBookings = async (req, res) => {
  try {
    let data = await getBookingsByFacility(req.params.id);
    if (!data) {
      data = [];
      return res.status(404).json({
        message: "There is no Booking found at that facility",
        data,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Booking retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const addBooking = async (req, res) => {
  try {
    if (!checkprivileges(req.user.privileges, "manage-facilities-booking")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    req.body.userid = req.user.id;
    let approval;

    let newBooking = await createBooking(req.body);
    let booking;

    const facilityInfo = await getOneBookingWithDetails(newBooking.id);
    if (
      facilityInfo.Facility.category === "computerLab" ||
      facilityInfo.Facility.category === "medicineLab"
    ) {
      approval = await getUserByPrivilegeForLab(
        "manage-lab-approval",
        req.user.campus,
        facilityInfo.Facility.managerId
      );
    }
    if (facilityInfo.Facility.category === "classRoom") {
      // if (facilityInfo.Facility.defaultGroups !== null) {
      //   let book = await prependingbookings(newBooking.id);
      //   booking = await getOneBookingWithDetails(newBooking.id);
      //   const facility = await getOneFacility(booking.Facility.id);
      //   const schoolId =
      //     facility.defaultGroups[0].intake.program.department.school.id;
      //   let school = await getOneSchoolWithDetails(schoolId);

      //   await new Email(
      //     school.schooldean,
      //     null,
      //     booking
      //   ).FacilityBookingRequestForDin();
      //   await addNotification(
      //     school.schooldean,
      //     "You have a new booking request",
      //     "new_request",
      //     booking.id,
      //     booking.Facility.id
      //   );
      //   await new Email(req.user, null, {
      //     ...facilityInfo,
      //   }).sendFacilityBookingConfirmation();
      // } else {
        approval = await getUserByPrivilege(
          "manage-facility-approval",
          req.user.campus
        );
        booking = await getOneBookingWithDetails(newBooking.id);

        await new Email(req.user, null, {
          ...facilityInfo,
        }).sendFacilityBookingConfirmation();

        if (approval && approval.length > 0) {
          approval.forEach(async (user) => {
            await new Email(user, null, {
              ...facilityInfo,
            }).sendFacilityBookingRequest();
            await addNotification(
              user.id,
              "You have a new booking request",
              "new_request",
              booking.id,
              booking.Facility.id
            );
          });
        }
      // }
    } else {
      approval = await getUserByPrivilegeForLab(
        "manage-lab-approval",
        req.user.campus,
        facilityInfo.Facility.managerId
      );
      booking = await getOneBookingWithDetails(newBooking.id);

      await new Email(req.user, null, {
        ...facilityInfo,
      }).sendFacilityBookingConfirmation();

      if (approval && approval.length > 0) {
        approval.forEach(async (user) => {
          await new Email(user, null, {
            ...facilityInfo,
          }).sendFacilityBookingRequest();
          await addNotification(
            user.id,
            "You have a new booking request",
            "new_request",
            booking.id,
            booking.Facility.id
          );
        });
      }
    }
    const approvalToken = await generateApprovalToken(newBooking);
    facilityInfo.approvalToken = approvalToken;
    // send email

    booking = await getOneBookingWithDetails(newBooking.id);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      Booking: booking,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
export const getLabManagers = async (req, res) => {
  try {
    req.body.userid = req.user.id;
    let managers;
    managers = await getUserByPrivilege("manage-lab-approval", req.user.campus);
    return res.status(201).json({
      success: true,
      message: "managers retrieved successfully",
      managers: managers,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
export const getLabTechnitian = async (req, res) => {
  try {
    req.body.userid = req.user.id;
    let technitian;
    technitian = await getUserByPrivilege(
      "manage-lab-technitian",
      req.user.campus
    );
    return res.status(201).json({
      success: true,
      message: "technitian retrieved successfully",
      technitian: technitian,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getSchoolDean = async (req, res) => {
  try {
    req.body.userid = req.user.id;
    let schooldins;
    schooldins = await getUserByPrivilege("school-dean", req.user.campus);
    return res.status(201).json({
      success: true,
      message: "schooldins retrieved successfully",
      schooldins: schooldins,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const cancelOneBooking = async (req, res) => {
  try {
    if (!checkprivileges(req.user.privileges, "manage-facilities-booking")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const BookingInfo = await getOneBookingWithDetails(req.params.id);
    const Booking = await cancelBooking(req.params.id);
    if (!Booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    let approval;

    if (
      BookingInfo.Facility.category === "computerLab" ||
      BookingInfo.Facility.category === "medicineLab"
    ) {
      approval = await getUserByPrivilegeForLab(
        "manage-lab-approval",
        req.user.campus,
        BookingInfo.Facility.managerId
      );
    } else {
      approval = await getUserByPrivilege(
        "manage-facility-approval",
        req.user.campus
      );
    }

    if (BookingInfo.status === "approved") {
      return res.status(404).json({
        success: false,
        message: "Booking aready approved",
      });
    }

    if (BookingInfo.status === "rejected") {
      return res.status(404).json({
        success: false,
        message: "Booking aready rejected",
      });
    }

    if (!Booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // send email
    await new Email(req.user, null, BookingInfo).sendFacilityBookingCancered();

    if (approval && approval.length > 0) {
      approval.forEach(async (user) => {
        await new Email(user, null, BookingInfo).sendFacilityBookingCancered();
        await addNotification(
          user.id,
          "Booking request canceled",
          "request_canceled",
          BookingInfo.id,
          BookingInfo.Facility.id
        );
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking canceled successfully",
      Booking,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const delete_Rejected_Booking_request = async (req, res) => {
  try {
    if (!checkprivileges(req.user.privileges, "manage-lab-approval") &&
    !checkprivileges(req.user.privileges, "manage-facility-approval")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    const BookingInfo = await getOneBookingWithDetails(req.params.id);
    if (!BookingInfo) {
      return res.status(404).json({
        success: false,
        message: "Booking request not found",
      });
    }
  
    if (BookingInfo.status === "rejected") {
      const Booking = await cancelBooking(req.params.id);
    }

    return res.status(200).json({
      success: true,
      message: "Rejected Request deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const getOneBooking = async (req, res) => {
  try {
    const { id } = req.params;
    let data = await getOneBookingWithDetails(id);
    if (!data) {
      data = [];
      return res.status(404).json({
        message: "Booking not found",
        data,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Booking retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const getOnePreBooking = async (req, res) => {
  try {
    const { id } = req.params;
    let data = await getOnepreBookingWithDetails(id);
    if (!data) {
      data = [];
      return res.status(404).json({
        message: "Booking not found",
        data,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Booking retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const updateOneBooking = async (req, res) => {
  try {
    if (!checkprivileges(req.user.privileges, "manage-classroom-booking")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    req.body.userid = req.user.id;
    const updatedBooking = await updateBooking(req.params.id, req.body);

    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const approveBooking = async (req, res) => {
  try {
    if (
      !checkprivileges(req.user.privileges, "manage-facility-approval") &&
      !checkprivileges(req.user.privileges, "manage-lab-approval") &&
      !checkprivileges(req.user.privileges, "school-dean")
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    const existingBooking = await getOneBookingWithDetails(req.params.id);

    const technitian = await getUser(existingBooking.Facility.technicianId);
    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      existingBooking.Facility.category === "computerLab" ||
      existingBooking.Facility.category === "medicineLab"
    ) {
      if (existingBooking.Facility.managerId != req.user.id) {
        return res.status(401).json({
          success: false,
          message: "You are not allowed to approve this lab booking",
        });
      } else {
        const booking = await approvebookings(req.params.id);
        if (!booking) {
          return res.status(404).json({
            success: false,
            message: "booking not found",
          });
        }
        await new Email(
          existingBooking.User,
          null,
          existingBooking
        ).sendFacilityBookingApproval();

        await addNotification(
          existingBooking.User.id,
          "Your booking request approved",
          "request_approved",
          existingBooking.id,
          existingBooking.Facility.id
        );

        await new Email(
          technitian,
          null,
          existingBooking
        ).FacilityBookingApproval_technitian();
        await addNotification(
          technitian.id,
          "Booking request approved",
          "request_approved",
          existingBooking.id,
          existingBooking.Facility.id
        );
      }
    }
    if (existingBooking.Facility.category === "classRoom") {
      if (
        existingBooking.status === "pre-pending" &&
        checkprivileges(req.user.privileges, "school-dean")
      ) {
        let approval;
        // console.log(existingBooking.Facility.id);
        // const facilityInfo = await getOneBookingWithDetails(newBooking.id);
        const booking = await approveTOpendingbookings(req.params.id);

        approval = await getUserByPrivilege(
          "manage-facility-approval",
          req.user.campus
        );

        if (approval && approval.length > 0) {
          approval.forEach(async (user) => {
            await new Email(user, null, {
              ...existingBooking,
            }).sendFacilityBookingRequest();
            await addNotification(
              user.id,
              "You have a new booking request",
              "new_request",
              existingBooking.id,
              existingBooking.Facility.id
            );
          });
        }

        if (!booking) {
          return res.status(404).json({
            success: false,
            message: "booking not found",
          });
        }
      } else {
        const booking = await approvebookings(req.params.id);
        if (!booking) {
          return res.status(404).json({
            success: false,
            message: "booking not found",
          });
        }
        await new Email(
          existingBooking.User,
          null,
          existingBooking
        ).sendFacilityBookingApproval();
        await addNotification(
          existingBooking.User.id,
          "Your booking request approved",
          "request_approved",
          existingBooking.id,
          existingBooking.Facility.id
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "booking approved successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const rejectBooking = async (req, res) => {
  try {
    if (
      !checkprivileges(req.user.privileges, "manage-facility-approval") &&
      !checkprivileges(req.user.privileges, "manage-lab-approval") &&
      !checkprivileges(req.user.privileges, "school-dean")
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    const existingBooking = await getOneBookingWithDetails(req.params.id);
    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      existingBooking.Facility.category === "computerLab" ||
      existingBooking.Facility.category === "medicineLab"
    ) {
      if (existingBooking.Facility.managerId != req.user.id) {
        return res.status(401).json({
          success: false,
          message: "You are not allowed to reject this lab booking",
        });
      } else {
        const booking = await rejectingbookings(req.params.id);
        if (!booking) {
          return res.status(404).json({
            success: false,
            message: "booking not found",
          });
        }
        const reason = req.body.reason_to_reject;
        await new Email(
          existingBooking.User,
          null,
          existingBooking,
          reason
        ).sendFacilityBookingRejection();
        await addNotification(
          existingBooking.User.id,
          "Your booking request rejected",
          "request_rejected",
          existingBooking.id,
          existingBooking.Facility.id
        );
      }
    } else {
      const booking = await rejectingbookings(req.params.id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "booking not found",
        });
      }
      const reason = req.body.reason_to_reject;
      await new Email(
        existingBooking.User,
        null,
        existingBooking,
        reason
      ).sendFacilityBookingRejection();
      await addNotification(
        existingBooking.User.id,
        "Your booking request rejected",
        "request_rejected",
        existingBooking.id,
        existingBooking.Facility.id
      );
    }

    return res.status(200).json({
      success: true,
      message: "booking approved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const approveBookingViaEmail = async (req, res) => {
  try {
    const approvalToken = req.params.token;
    const bookingData = await checkApprovalToken(approvalToken);
    if (!bookingData) {
      return res.status(404).json({
        success: false,
        message: "Invalid token or token expired",
      });
    }

    const existingBooking = await getOneBookingWithDetails(bookingData.id);
    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    if (existingBooking.status === "approved") {
      return res.status(404).json({
        success: false,
        message: "Booking aready approved",
      });
    }
    if (existingBooking.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Booking aready rejected",
      });
    }
    const booking = await approvebookings(bookingData.id);
    if (!booking) {
      return res.status(400).json({
        success: false,
        message: "booking not found",
      });
    }
    await new Email(
      existingBooking.User,
      null,
      existingBooking
    ).sendClassRoomBookingApproval();
    await addNotification(
      existingBooking.User.id,
      "Your booking request approved",
      "request_approved",
      existingBooking.id,
      existingBooking.Facility.id
    );

    return res.status(200).json({
      success: true,
      message: "booking approved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const rejectBookingViaEmail = async (req, res) => {
  try {
    const approvalToken = req.params.token;
    const bookingData = await checkApprovalToken(approvalToken);
    const existingBooking = await getOneBookingWithDetails(bookingData.id);
    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    if (existingBooking.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Booking aready approved",
      });
    }
    if (existingBooking.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Booking aready rejected",
      });
    }
    const booking = await rejectingbookings(bookingData.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "booking not found",
      });
    }
    const reason = req.body.reason_to_reject;
    await new Email(
      existingBooking.User,
      null,
      existingBooking,
      reason
    ).sendClassRoomBookingRejection();
    await addNotification(
      existingBooking.User.id,
      "Your booking request rejected",
      "request_rejected",
      existingBooking.id,
      existingBooking.Facility.id
    );
    return res.status(200).json({
      success: true,
      message: "booking rejected successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const getFacilityBookingsReport = async (req, res) => {
  const { id } = req.params;
  try {
    const { startDate, endDate } = req.query;
    let data = await getBookings();

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
        data: [],
      });
    }
    if (startDate && endDate) {
      data = data.filter((booking) => {
        const bookingStartDate = new Date(booking.startPeriod);
        const bookingEndDate = new Date(booking.endPeriod);
        const rangeStartDate = new Date(startDate);
        const rangeEndDate = new Date(endDate);
        return (
          bookingStartDate <= rangeEndDate &&
          bookingEndDate >= rangeStartDate &&
          booking.status == "approved" &&
          booking.Facility.id == id
        );
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const getFacilitiesBookingsReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let data = await getBookings();

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
        data: [],
      });
    }
    if (startDate && endDate) {
      data = data.filter((booking) => {
        const bookingStartDate = new Date(booking.startPeriod);
        const bookingEndDate = new Date(booking.endPeriod);
        const rangeStartDate = new Date(startDate);
        const rangeEndDate = new Date(endDate);
        return (
          bookingStartDate <= rangeEndDate &&
          bookingEndDate >= rangeStartDate &&
          booking.status == "approved"
        );
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

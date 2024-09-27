import express from "express";

import {
  addBooking,
  BookingWithAll,
  getOneBooking,
  updateOneBooking,
  approveBooking,
  rejectBooking,
  getFacilityBookings,
  cancelOneBooking,
  Bookingrejected,
  Bookingapproved,
  Bookingpending,
  approveBookingViaEmail,
  rejectBookingViaEmail,
  getLabManagers,
  getLabTechnitian,
  getSchoolDean,
  pregpending,
  getOnePreBooking,
  getFacilityBookingsReport,
  getFacilitiesBookingsReport,
  delete_Rejected_Booking_request
} from "../controllers/bookingController";
import { protect } from "../middlewares/protect";

const router = express.Router();

router.get("/facilities/:id", protect, getFacilityBookings);
router.get("/facility/:id/report", protect, getFacilityBookingsReport);
router.get("/facilitiesReport", protect, getFacilitiesBookingsReport);
router.delete("/cancel/:id", protect, cancelOneBooking);
router.delete("/rejected/:id", protect, delete_Rejected_Booking_request);
router.post("/add/", protect, addBooking);
router.get("/", protect, BookingWithAll);
router.get("/one/:id", protect, getOneBooking);
router.get("/one/prepending/:id", protect, getOnePreBooking);
router.put("/:id", protect, updateOneBooking);
router.put("/approve/:id", protect, approveBooking);
router.put("/reject/:id", protect, rejectBooking);
router.get("/rejected", protect, Bookingrejected);
router.get("/approved", protect, Bookingapproved);
router.get("/pending", protect, Bookingpending);
router.get("/prepending", protect, pregpending);
router.put("/approveViaEmail/:token", approveBookingViaEmail);
router.put("/rejectViaEmail/:token", rejectBookingViaEmail);
router.get("/managers/", protect, getLabManagers);
router.get("/technitians/", protect, getLabTechnitian);
router.get("/schooldean/", protect, getSchoolDean);



export default router;

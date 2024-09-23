import jwt from "jsonwebtoken";
import { getoneBooking } from "../services/bookingService.js";

// generate approval token
export const generateApprovalToken = (booking) => {
  const token = jwt.sign({ id: booking.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

// check approval token
export const checkApprovalToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded) {
      const booking = await getoneBooking(decoded.id);
      return booking;
    }
  } catch (error) {
    return null;
  }
};

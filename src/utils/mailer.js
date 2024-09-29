import ejs from "ejs";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import formatDate from "../helpers/formatDate";
dotenv.config();

class Email {
  constructor(user, url, booking, reason, facility = null) {
    this.to = user.email;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.password = user.password;
    this.email = user.email;
    this.from = process.env.EMAIL_FROM;
    this.url = url;
    this.booking = booking;
    this.reason = reason;
    this.facility = facility;
  }

  // Create a transporter
  createTransport() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Send the actual email
  async send(template, subject, title) {
    const transporter = this.createTransport();

    // 1) Render HTML based on an ejs template
    const html = await ejs.renderFile(
      path.join(__dirname, `./../views/email/${template}.ejs`),
      {
        firstname: this.booking ? this.booking?.User.firstname : this.firstname,
        lastname: this.booking ? this.booking.User.lastname : this.lastname,
        password: this.password,
        email: this.email,
        url: this.url,
        facility: this.facility ? this.facility : this.booking?.Facility,
        startPeriod: this.booking ? formatDate(this.booking.startPeriod) : null,
        endPeriod: this.booking ? formatDate(this.booking.endPeriod) : null,
        requester_name: this.booking
          ? this.booking.User.firstname + " " + this.booking.User.lastname
          : null,
        requester_email: this.booking ? this.booking.User.email : null,
        requester_phone: this.booking ? this.booking.User.phone : null,
        approvalToken: this.booking ? this.booking.approvalToken : null,
        reason: this.reason,
      }
    );

    // 2) Define email options
    const mailOptions = {
      to: this.to, // Change to your recipient
      from: this.from, // Change to your verified sender
      subject,
      text: html, // Optional: plain text body
      html,
    };

    // 3) Send email
    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent....");
    } catch (error) {
      console.error(error);
    }
  }

  async sendAccountAdded() {
    await this.send("accountAdded", "Welcome to UR facilities allocation");
  }
  
  async sendgroupcode() {
    await this.send("classrepresentativeEmail", "group created successfully");
  }
  
  async sendFacilityBookingConfirmation() {
    await this.send("FacilityBookingConfirmation", "Facility Booking Confirmation");
  }

  async sendResetPassword() {
    await this.send("resetPassword", "Reset Password");
  }

  // Cancel email
  async sendFacilityBookingCanceled() {
    await this.send("FacilityBookingCanceled", "Facility Booking Canceled");
  }

  async sendFacilityBookingRequest() {
    await this.send("FacilityBookingRequest", "Facility Booking Request");
  }

  async FacilityBookingRequestForDin() {
    await this.send("FacilityBookingRequestForDin", "Facility Booking Request");
  }
  
  async sendFacilityBookingApproval() {
    await this.send("FacilityBookingApproval", "Facility Booking Approval");
  }

  async sendFacilityBookingRejection() {
    await this.send("FacilityBookingRejection", "Facility Booking Rejection");
  }

  async FacilityBookingApproval_technitian() {
    await this.send("FacilityBookingApproval_technitian", "Facility Booking Notification");
  }

  async sendAssignedDean() {
    await this.send("FacilityAssigned", "Facility Assigned Intake");
  }

  async sendCPNotification() {
    await this.send("CPNotification", "Facility Assigned Intake");
  }
}

export default Email;

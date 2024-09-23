import ejs from "ejs";
import path from "path";
import sgMail from "@sendgrid/mail";
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

  // Send the actual email
  async send(template, subject, title) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // 1) Render HTML based on a ejs template
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
      text: html,
      html,
    };
    // 3) Create a transport and send email
    sgMail
      .send(mailOptions)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async sendAccountAdded() {
    await this.send("accountAdded", "Welcome to UR facilities allocation");
  }
  async sendFacilityBookingConfirmation() {
    await this.send(
      "FacilityBookingConfirmation",
      "Facility Booking Confirmation"
    );
  }
  async sendResetPassword() {
    await this.send("resetPassword", "Reset Password");
  }

  //cancel email
  async sendFacilityBookingCancered() {
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
    await this.send(
      "FacilityBookingApproval_technitian",
      "Facility Booking Notification"
    );
  }

  async sendAssignedDean() {
    await this.send("FacilityAssigned", "Facility Assigned Intake");
  }

  async sendCPNotification() {
    await this.send("CPNotification", "Facility Assigned Intake");
  }
}

export default Email;

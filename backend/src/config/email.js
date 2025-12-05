import nodemailer from "nodemailer";
import { config } from "./env.js";

export const mailTransporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: config.smtpPort === 465, // true for 465, false for others
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass
  }
});

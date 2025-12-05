import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  openaiApiKey: process.env.OPENAI_API_KEY,
  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  imapHost: process.env.IMAP_HOST,
  imapPort: Number(process.env.IMAP_PORT || 993),
  imapUser: process.env.IMAP_USER,
  imapPass: process.env.IMAP_PASS,
  imapMailbox: process.env.IMAP_MAILBOX || "INBOX",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173"
};

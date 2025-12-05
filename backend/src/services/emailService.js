import { mailTransporter } from "../config/email.js";
import { config } from "../config/env.js";
import { prisma } from "../config/db.js";
import { ImapFlow } from "imapflow";
import { parseVendorEmail } from "./aiService.js";

export async function sendRfpEmails(rfp, vendors) {
  const html = `
    <p>Dear Vendor,</p>
    <p>Please find below the RFP details:</p>
    <pre>${JSON.stringify(rfp.structuredJson, null, 2)}</pre>
    <p>Kindly respond with your proposal including pricing, delivery timeline, warranty and payment terms.</p>
  `;

  for (const vendor of vendors) {
    await mailTransporter.sendMail({
      from: config.smtpUser,
      to: vendor.email,
      subject: `RFP: ${rfp.title}`,
      html
    });
  }
}

// Basic polling function; call from index.js once app starts
export async function startEmailPolling() {
  const client = new ImapFlow({
    host: config.imapHost,
    port: config.imapPort,
    secure: true,
    auth: {
      user: config.imapUser,
      pass: config.imapPass
    }
  });

  await client.connect();
  await client.mailboxOpen(config.imapMailbox);

  setInterval(async () => {
    try {
      const searchCriteria = ["UNSEEN"];
      for await (let msg of client.search(searchCriteria, { uid: true, source: true })) {
        const { uid, envelope, source } = msg;

        // crude parsing of body
        const emailText = source.toString();
        const fromEmail = envelope.from[0].address;

        // find vendor by email
        const vendor = await prisma.vendor.findFirst({
          where: { email: fromEmail }
        });
        if (!vendor) {
          continue; // unknown vendor
        }

        // For demo: we assume this email corresponds to latest RFP (or you can add tagging)
        const latestRfp = await prisma.rfp.findFirst({
          orderBy: { createdAt: "desc" }
        });
        if (!latestRfp) continue;

        const parsedJson = await parseVendorEmail(emailText);

        await prisma.proposal.create({
          data: {
            rfpId: latestRfp.id,
            vendorId: vendor.id,
            rawEmailText: emailText,
            parsedJson
          }
        });

        // mark as seen
        await client.messageFlagsAdd({ uid }, ["\\Seen"]);
      }
    } catch (err) {
      console.error("Error while polling emails:", err.message);
    }
  }, 30000); // every 30 seconds
}

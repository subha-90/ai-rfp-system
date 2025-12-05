import fs from "fs";
import { openai } from "../config/openai.js";

/* ============================================================
   1️⃣ Extract Text From File (PDF/DOCX Upload)
   ============================================================ */
export async function extractTextFromFile(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);

    const completion = await openai.responses.create({
      model: "gpt-4.1",
      input: [
        {
          role: "system",
          content: "Extract clean text from the uploaded document."
        },
        {
          role: "user",
          content: [
            {
              type: "input_file",
              file: fileBuffer,
              mimeType: "application/octet-stream"
            }
          ]
        }
      ]
    });

    return completion.output[0].content[0].text;
  } catch (err) {
    console.error("extractTextFromFile Error:", err);
    return "";
  }
}

/* ============================================================
   2️⃣ Generate Structured RFP From Natural Text
   ============================================================ */
export async function generateRfpFromText(naturalText) {
  const prompt = `
You are an assistant that converts procurement needs into structured RFP JSON.

Input:
${naturalText}

Output strict JSON:
{
  "title": string,
  "category": string,
  "budget": number | null,
  "delivery_timeline": string,
  "payment_terms": string,
  "warranty": string,
  "items": [
    {
      "name": string,
      "quantity": number,
      "specs": string
    }
  ]
}
  `;

  const completion = await openai.responses.create({
    model: "gpt-4o-mini",
    input: prompt
  });

  const text = completion.output[0].content[0].text;

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("JSON Parse Error in generateRfpFromText:", error);
    return {};
  }
}

/* ============================================================
   3️⃣ Parse Vendor Email into Structured Proposal JSON
   ============================================================ */
export async function parseVendorEmail(emailBody) {
  const prompt = `
You parse vendor proposal emails.

Extract and return only JSON:
{
  "total_price": number,
  "currency": string,
  "delivery_days": number,
  "warranty": string,
  "payment_terms": string,
  "line_items": [
    { "name": string, "quantity": number, "unit_price": number, "total_price": number }
  ],
  "notes": string
}

Email:
${emailBody}
  `;

  const completion = await openai.responses.create({
    model: "gpt-4o-mini",
    input: prompt
  });

  const text = completion.output[0].content[0].text;

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("JSON Parse Error in parseVendorEmail:", error);
    return {};
  }
}

/* ============================================================
   4️⃣ Compare All Proposals For An RFP
   ============================================================ */
export async function compareProposals(rfpDescription, proposals) {
  const prompt = `
You evaluate vendor proposals for an RFP.

RFP Description:
${rfpDescription}

Vendor Proposals:
${JSON.stringify(proposals, null, 2)}

Scoring criteria:
- Price (40%)
- Delivery time (30%)
- Payment terms (15%)
- Warranty (15%)

Return ONLY JSON:
[
  { "proposalId": number, "scoreJson": { "score": number, "recommendation": string } }
]
  `;

  const completion = await openai.responses.create({
    model: "gpt-4.1",
    input: prompt
  });

  const text = completion.output[0].content[0].text;

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("JSON Parse Error in compareProposals:", error);
    return [];
  }
}

import { safeAI } from "../utils/safeAi.js";

export async function parseVendorEmail(emailBody) {
  return safeAI(
    async () => {
      const prompt = `
        Extract proposal details from this email...
        Email:
        ${emailBody}
      `;

      const completion = await openai.responses.create({
        model: "gpt-4o-mini",
        input: prompt
      });

      const text = completion.output[0].content[0].text;
      return JSON.parse(text);
    },

    // fallback JSON if AI fails (quota issue)
    {
      total_price: 0,
      currency: "N/A",
      delivery_days: 0,
      warranty: "N/A",
      payment_terms: "N/A",
      line_items: [],
      notes: "AI fallback activated (insufficient quota)"
    }
  );
}

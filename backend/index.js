import app from "./app.js";
import { config } from "./src/config/env.js";
import { startEmailPolling } from "./src/services/emailService.js";

app.listen(config.port, () => {
  console.log(`Backend listening on port ${config.port}`);
  startEmailPolling().catch((err) =>
    console.error("Failed to start email polling:", err.message)
  );
});

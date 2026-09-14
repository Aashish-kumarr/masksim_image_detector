import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";

async function main() {
  try {
    await connectDatabase();
  } catch (error) {
    console.error("[db] startup connection failed:", error.message);
  }

  app.listen(env.port, () => {
    console.log(`[backend] http://localhost:${env.port}`);
    console.log(`[backend] ML_MODE=${env.mlMode}`);
  });
}

main();

import fs from "node:fs";
import path from "node:path";

export default async function globalSetup(): Promise<void> {
  const downloadsDir = path.resolve(process.cwd(), "test-results/downloads");

  if (fs.existsSync(downloadsDir)) {
    fs.rmSync(downloadsDir, { recursive: true, force: true });
  }

  fs.mkdirSync(downloadsDir, { recursive: true });
}

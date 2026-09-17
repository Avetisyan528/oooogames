import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import { passwordHash } from "./app.mjs";
const password = randomBytes(18).toString("base64url");
try {
  await fs.writeFile(
    ".env",
    "ADMIN_PASSWORD_HASH=" + passwordHash(password) + "\n",
    { flag: "wx", mode: 0o600 },
  );
  console.log(
    "Administrator credentials created. Keep this password in your password manager:\n\n" +
      password +
      "\n\nRestart the studio server, then open /#/admin. The password cannot be recovered from the stored hash.",
  );
} catch (e) {
  if (e.code === "EEXIST") {
    console.error(
      "An .env file already exists. It was not changed. Follow README.md to configure or rotate the administrator password.",
    );
    process.exitCode = 1;
  } else throw e;
}

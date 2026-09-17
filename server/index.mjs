import { createStudioServer } from "./app.mjs";
const port = Number(process.env.API_PORT || 3001);
const host = process.env.HOST || "127.0.0.1";
const server = await createStudioServer();
server.listen(port, host, () =>
  console.log(`Studio server: http://${host}:${port}`),
);

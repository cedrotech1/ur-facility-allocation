import dotenv from "dotenv";
import app from "./app";

import { ioConnect } from "./helpers/socketio";
import httpServer from "http";

const http = httpServer.Server(app);
const port = process.env.PORT || 4000;

try {
  http.listen(port, () => {
    console.log(`server running on port ${port} `);
  });
  ioConnect(http);
} catch (error) {
  console.log(error);
}

export default http;


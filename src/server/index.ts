import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import httpErrors from "http-errors";
import morgan from "morgan";
import * as path from "path";
import { createServer } from "http";

dotenv.config();

import * as configuration from "./config";
import * as middleware from "./middleware";
import * as routes from "./routes";

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(middleware.tailwind);

const staticPath = path.join(process.cwd(), "src", "public");
app.use(express.static(staticPath));

configuration.configureLiveReload(app, staticPath);
configuration.configureSocketIO(
  server,
  app,
  configuration.configureSession(app),
);

app.use(cookieParser());
app.set("views", path.join(process.cwd(), "src", "server", "views"));
app.set("view engine", "ejs");

app.use(middleware.chat);

app.use("/", routes.home);
app.use("/lobby", middleware.authentication, routes.mainLobby);
app.use("/auth", routes.auth);
app.use("/games", middleware.authentication, routes.games);
app.use("/chat", middleware.authentication, routes.chat);

app.use((_request, _response, next) => {
  next(httpErrors(404));
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

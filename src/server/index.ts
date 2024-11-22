import express from "express";
import rootRoutes from "./routes/root";
import httpErrors from "http-errors";
import { timeMiddleware } from "./middleware/time";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import connectLiveReload from "connect-livereload";
import livereload from "livereload";

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware for logging
app.use(morgan("dev"));

//Middleware for parsing cookies
app.use(cookieParser());

//Middleware for parsing JSON
app.use(express.json());

//Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: false }));

//Middleware for serving static files
app.use(express.static(path.join(process.cwd(), "src", "public")));
app.use(timeMiddleware);

const staticPath = path.join(process.cwd(), "src", "public");
app.use(express.static(staticPath));
if (process.env.NODE_ENV === "development") {
  const reloadServer = livereload.createServer();
  reloadServer.watch(staticPath);
  reloadServer.server.once("connection", () => {
    setTimeout(() => {
      reloadServer.refresh("/");
    }, 100);
  });
  app.use(connectLiveReload());
}

//Routes
app.use("/", rootRoutes);

//Error handling
app.use((_req, _res, next) => {
  next(httpErrors(404));
});

//Views setupt
app.set("views", path.join(process.cwd(), "src", "server", "views"));
app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

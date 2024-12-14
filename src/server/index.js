"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const root_1 = __importDefault(require("./routes/root"));
const http_errors_1 = __importDefault(require("http-errors"));
const time_1 = require("./middleware/time");
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const connect_livereload_1 = __importDefault(require("connect-livereload"));
const livereload_1 = __importDefault(require("livereload"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
//Middleware for logging
app.use((0, morgan_1.default)("dev"));
//Middleware for parsing cookies
app.use((0, cookie_parser_1.default)());
//Middleware for parsing JSON
app.use(express_1.default.json());
//Middleware for parsing URL-encoded data
app.use(express_1.default.urlencoded({ extended: false }));
//Middleware for serving static files
app.use(
  express_1.default.static(path_1.default.join(process.cwd(), "src", "public")),
);
app.use(time_1.timeMiddleware);
const staticPath = path_1.default.join(process.cwd(), "src", "public");
app.use(express_1.default.static(staticPath));
if (process.env.NODE_ENV === "development") {
  const reloadServer = livereload_1.default.createServer();
  reloadServer.watch(staticPath);
  reloadServer.server.once("connection", () => {
    setTimeout(() => {
      reloadServer.refresh("/");
    }, 100);
  });
  app.use((0, connect_livereload_1.default)());
}
//Routes
app.use("/", root_1.default);
//Error handling
app.use((_req, _res, next) => {
  next((0, http_errors_1.default)(404));
});
//Views setupt
app.set("views", path_1.default.join(process.cwd(), "src", "server", "views"));
app.set("view engine", "ejs");
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeMiddleware = void 0;
const timeMiddleware = (req, res, next) => {
  console.log(`Time: ${new Date()}`);
  next();
};
exports.timeMiddleware = timeMiddleware;

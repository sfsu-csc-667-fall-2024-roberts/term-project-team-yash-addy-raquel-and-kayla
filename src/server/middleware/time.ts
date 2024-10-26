import { NextFunction, Request, Response } from "express";
const timeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`Time: ${new Date()}`);
  next();
};
export { timeMiddleware };

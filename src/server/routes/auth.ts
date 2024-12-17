// Routes for user authentication

import express from "express";
const router = express.Router();
router.get("/auth", (_request, response) => {
  response.render("auth", { title: "Login and signup" });
});
export default router;

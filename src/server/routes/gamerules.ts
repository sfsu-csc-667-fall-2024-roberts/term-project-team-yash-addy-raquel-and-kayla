import express from "express";
const router = express.Router();
router.get("/", (_request, response) => {
  response.render("gamerules", { title: "Rules" });
});
export default router;

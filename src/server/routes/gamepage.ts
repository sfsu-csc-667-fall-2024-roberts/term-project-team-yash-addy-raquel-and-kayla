import express from "express";
const router = express.Router();
router.get("/gamepage", (_request, response) => {
  response.render("gamepage", { title: "Rules" });
});
export default router;

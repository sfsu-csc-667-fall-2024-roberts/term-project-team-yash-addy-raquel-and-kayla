import express from "express";
const router = express.Router();
router.get("/gamelobby", (_request, response) => {
  response.render("gamelobby", { title: "Rules" });
});
export default router;

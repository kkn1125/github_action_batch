const { Router } = require("express");

const appRouter = Router();

appRouter.get("/", (req, res) => {
  res.send("Hello!");
});

module.exports = appRouter;

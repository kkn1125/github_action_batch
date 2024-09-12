const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const path = require("path");
const cors = require("cors");
const appRouter = require("./routes/appRouter");

dotenv.config({
  path: path.join(path.resolve(), ".env"),
});

async function run() {
  const { data } = await axios.default.get(`https://api.myip.com`);

  console.log(data);

  const ip = data.ip;

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", appRouter);

  app.use((req, res, next) => {
    console.log(`Request ===> [${req.method}] ${req.originalUrl}`);
    next();
  });

  app.use(appRoute);

  app.listen(8000, () => {
    console.log(`listening on http://${ip}:8000`);
  });
}

run();

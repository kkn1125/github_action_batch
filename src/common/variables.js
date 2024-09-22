const dotenv = require("dotenv");
dotenv.config();

const MODE = process.env.NODE_ENV || "production";
const EMAIL_PASS = process.env.EMAIL_PASS;
const DONG = +(process.env.DONG || 'sangbong1');

module.exports.MODE = MODE;
module.exports.EMAIL_PASS = EMAIL_PASS;
module.exports.DONG = DONG;

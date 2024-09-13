const nodemailer = require("nodemailer");
// const GoogleSearchCrawler = require("./module/GoogleSearchCrawler");
const { EMAIL_PASS, MODE } = require("./common/variables");
const WeatherCrawler = require("./module/WeatherCrawler");

const crawler = new WeatherCrawler();

if (!EMAIL_PASS) {
  console.log("not allowed password!");
  process.exit(0);
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "chaplet01@gmail.com",
    pass: EMAIL_PASS,
  },
});

async function test(crawlerModule) {
  console.log("🛠️ run mode is test.");
  const result = await crawlerModule.crawling();
  console.log(result);
}

// async..await is not allowed in global scope, must use a wrapper
async function main(crawlerModule) {
  await crawlerModule.crawling();
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"NodeMailer 💡" <norelpy@example.com>', // sender address
    to: "chaplet01@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: crawlerModule.formHTML(), // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  process.exit(0);
}

if (MODE === "production") main(crawler).catch(console.error);
else test(crawler).catch(console.error);

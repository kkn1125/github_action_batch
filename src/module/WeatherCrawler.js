const { sleep } = require("../util/sleep");
const Crawler = require("./Crawler");
const { DONG } = require("../common/variables");

const dongs = {
  sangbong1:
    "#dong/1126059000/37.58961/127.08539/서울특별시%20중랑구%20상봉제2동/SEL/상봉제2동",
  sangbong2:
    "#dong/4817059500/35.198563/128.0751/경상남도%20진주시%20상봉동/SEL/상봉동",
  samsung:
    "#dong/1168058000/37.50904/127.05753/서울특별시%20강남구%20삼성1동/SEL/삼성1동",
};

class WeatherCrawler extends Crawler {
  results;
  doCrawling = async () => {
    const browser = await this.puppeteer.launch({
      headless: "shell",
      devtools: true,
    });
    const page = (await browser.pages()).at(0);

    await page.goto(`https://www.weather.go.kr/w/index.do${dongs[DONG]}`);
    await page.waitForSelector(".dfs-daily-slide");
    const els = await page.evaluate(() => {
      const slides = [...document.querySelectorAll(".dfs-daily-slide")];
      console.log("slides", slides);
      return slides.map((el) => {
        const date = el.querySelector("h4").innerText.replace(/[\n]+/g, " ");

        const weathers = el
          .querySelector(".dfs-daily-item")
          .innerText.split("\n");

        console.log("weathers", weathers);

        function replaceOthers(text) {
          return text.replace(/[:()\[\]\_]+/g, "").trim();
        }

        const isOnlyOneOptionWeather = el.querySelector(
          ".dfs-daily-item > .daily-weather-allday"
        );
        const isOnlyOneOptionRain = el.querySelector(
          ".dfs-daily-item > .daily-pop-allday"
        );

        if (isOnlyOneOptionWeather) {
          const noonWeather = weathers
            .slice(0, 2)
            .map(replaceOthers)
            .join(": ");
          const afternoonWeather = noonWeather;
          const min = weathers.slice(2, 4).map(replaceOthers).join(": ");
          const max = weathers.slice(4, 6).map(replaceOthers).join(": ");
          const noonRainRatio = weathers
            .slice(6, 8)
            .map(replaceOthers)
            .join(": ");
          let afternoonRainRatio = weathers
            .slice(8, 10)
            .map(replaceOthers)
            .join(": ");

          if (isOnlyOneOptionRain) {
            afternoonRainRatio = noonRainRatio;
          }

          return {
            date,
            weather: {
              noon: noonWeather,
              afternoon: afternoonWeather,
            },
            temp: {
              min,
              max,
            },
            rainRatio: {
              noon: noonRainRatio,
              afternoon: afternoonRainRatio,
            },
          };
        } else {
          const noonWeather = weathers
            .slice(0, 2)
            .map(replaceOthers)
            .join(": ");
          const afternoonWeather = weathers
            .slice(2, 4)
            .map(replaceOthers)
            .join(": ");
          const min = weathers.slice(4, 6).map(replaceOthers).join(": ");
          const max = weathers.slice(6, 8).map(replaceOthers).join(": ");
          const noonRainRatio = weathers
            .slice(8, 10)
            .map(replaceOthers)
            .join(": ");
          let afternoonRainRatio = weathers
            .slice(10, 12)
            .map(replaceOthers)
            .join(": ");

          if (isOnlyOneOptionRain) {
            afternoonRainRatio = noonRainRatio;
          }

          return {
            date,
            weather: {
              noon: noonWeather,
              afternoon: afternoonWeather,
            },
            temp: {
              min,
              max,
            },
            rainRatio: {
              noon: noonRainRatio,
              afternoon: afternoonRainRatio,
            },
          };
        }
      });
    });
    this.results = els;
    await browser.close();
    return els;
  };

  constructor(...keywords) {
    super(...keywords);
    super.doCrawling = this.doCrawling;
  }

  formHTML() {
    const list = `
    <table>
      <thead>
        <tr>
          <th colspan="2"><h1 style="margin: 0;">날씨 정보 스케줄러</h1></th>
        </tr>
      </thead>
      <tbody>
        ${this.results
          .map(
            (item) => `
            <tr style="margin-bottom: 0.3rem;">
              <td colspan="2"><h3 style="margin: 0;">${item.date}</h3></td>
            </tr>
            <tr style="margin-bottom: 0.3rem;">
              <td><h4 style="margin: 0;">오전</h4></td>
              <td><h4 style="margin: 0;">오후</h4></td>
            </tr>
            <tr>
              <td>${item.weather.noon}</td>
              <td>${item.weather.afternoon}</td>
            </tr>
            <tr>
              <td>${item.temp.min}</td>
              <td>${item.temp.max}</td>
            </tr>
            <tr>
              <td>${item.rainRatio.noon}</td>
              <td>${item.rainRatio.afternoon}</td>
            </tr>
          `
          )
          .join("")}
      </tbody>
    </table>
    `;
    return list;
  }
}

module.exports = WeatherCrawler;

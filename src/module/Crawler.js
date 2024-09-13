const puppeteer = require("puppeteer");

/**
 * @class Crawler
 */
class Crawler {
  puppeteer = puppeteer;
  keywords;
  doCrawling;

  constructor(...keywords) {
    this.keywords = keywords;
  }

  async crawling() {
    if (!this.doCrawling) {
      throw new Error("크롤링 정보를 입력해주세요.");
    }
    try {
      return await this.doCrawling(this.keywords);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Crawler;

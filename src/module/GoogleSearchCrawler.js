const Crawler = require("./Crawler");

/**
 * @class GoogleSearchCrawler
 */
class GoogleSearchCrawler extends Crawler {
  doCrawling = async (...keywords) => {
    if (keywords.length === 0) {
      throw new Error("인자 값은 필수입니다.");
    }

    const browser = await this.puppeteer.launch({ headless: "shell" });
    const page = await browser.newPage();
    const searchKey = keywords[0];
    console.log("searchKey:", searchKey);
    await page.goto(
      `https://www.google.com/search?q=${searchKey}&newwindow=1&sca_esv=d21f97ffd6d7790a&sca_upv=1&udm=2&biw=1707&bih=932&sxsrf=ADLYWIJLHmhgK2q4Xi3-WQ89V2dYUGSANQ%3A1726213968729&ei=UO_jZu2fLN6pvr0Pwq3agA4&ved=0ahUKEwjth6aTuL-IAxXelK8BHcKWFuAQ4dUDCBA&uact=5&oq=%7B0%7D&gs_lp=Egxnd3Mtd2l6LXNlcnAiA3swfTIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgARI6r0LUABYAHACeACQAQCYAQCgAQCqAQC4AQPIAQCYAgKgAhKYAwCIBgGSBwEyoAcA&sclient=gws-wiz-serp`
    );
    const images = await page.$$eval(".mNsIhb > img", (els) =>
      els.slice(0, 20).map((el) => {
        const src = el.currentSrc;
        return src;
      })
    );
    await browser.close();
    return images;
  };
  constructor(...keywords) {
    super(...keywords);
    super.doCrawling = this.doCrawling;
  }
}

module.exports = GoogleSearchCrawler;

const MobileDetect = require("mobile-detect");
const axios = require("axios");
const response = require("./response");

// function getRequestAccessInfo(req, res) {
const getRequestAccessInfo = async (req, res) => {
  /**
   * ip, OS, device, browser, country, city 추출
   * - OS: Windows, Macintosh, IOS, Android, ...
   * - device: Desktop, Mobile, Tablet, ...
   * - browser: Chrome, Safari, ...
   */
  try {
    const md = new MobileDetect(req.headers["user-agent"]);
    if (md.is("bot")) {
      return res.status(400).json({ message: response.NOT_BOT });
    }
    const os = md.os();
    let device = "Desktop";
    if (md.mobile()) {
      device = "Mobile";
    }
    if (md.tablet()) {
      device = "Tablet";
    }
    const browser = md.userAgent();
    let ip = null;
    let city = null;
    let country = null;
    await axios.get("https://extreme-ip-lookup.com/json").then((res) => {
      ip = res.data.query;
      city = res.data.city; 
      country = res.data.country; 
    });
    console.log({ ip, os, device, browser, country, city });
    return { ip, os, device, browser, country, city };
  } catch (err) {
    throw err;
  }
};

module.exports = getRequestAccessInfo;

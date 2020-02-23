const puppeteer = require('puppeteer');
const cookies = require('./cookies');
const moment = require('moment');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1000,
        deviceScaleFactor: 1,
    });
    await page.setCookie(...cookies);
    console.log('cookies', ...cookies)
    const getCookies = await page.cookies();
    console.log('getCookies', getCookies);
    await page.goto('https://lanhuapp.com/web/#/item/project/board/detail?pid=e0eeb6b6-299b-4d3b-b923-75d2881006ad&project_id=e0eeb6b6-299b-4d3b-b923-75d2881006ad&image_id=ba40c2d2-4ae9-40e1-8350-dc17feb4e4c5');
    // other actions...
    await page.screenshot({ path: `screenshot-${moment().format('HHmmss')}.png` });
    await browser.close();
})();

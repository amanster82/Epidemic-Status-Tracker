const puppeteer = require('puppeteer');
const { raw } = require('express');

async function scrapeCovid(url){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    
    const [el] = await page.$x('//*[@id="british-columbia-collapse"]/div[1]/p[1]');

    const txt = await el.getProperty('textContent');
    const rawTxt = await txt.jsonValue()

    return rawTxt;
}

module.exports = scrapeCovid;
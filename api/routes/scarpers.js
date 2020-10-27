const puppeteer = require('puppeteer');
const { raw } = require('express');

async function scrapeCovid(url){
    const browser = await puppeteer.launch({
        args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        ], 
    });
    const page = await browser.newPage();
    await page.goto(url);

    //BC
    let [el] = await page.$x('//*[@id="british-columbia-collapse"]/div[1]/p[2]');
    let txt = await el.getProperty('textContent');
    let rawTxt = await txt.jsonValue();
    const BC = rawTxt;

    //AB  
    [el] = await page.$x('//*[@id="alberta-collapse"]/div[1]/p[1]');
    txt = await el.getProperty('textContent');
    rawTxt = await txt.jsonValue();
    const AB = rawTxt;

    //SK
    [el] = await page.$x('//*[@id="saskatchewan-collapse"]/div[1]/div[1]/p[1]');
    txt = await el.getProperty('textContent');
    rawTxt = await txt.jsonValue();
    const SK = rawTxt;

    //MB
    [el] = await page.$x('//*[@id="manitoba-collapse"]/div[1]/p[1]');
    txt = await el.getProperty('textContent');
    rawTxt = await txt.jsonValue();
    const MB = rawTxt;

    //ON
    [el] = await page.$x('//*[@id="ontario-collapse"]/div[1]/p[1]');
    txt = await el.getProperty('textContent');
    rawTxt = await txt.jsonValue();
    const ON = rawTxt;

    //QB
    [el] = await page.$x('//*[@id="quebec-collapse"]/div[1]/p[2]');
    txt = await el.getProperty('textContent');
    rawTxt = await txt.jsonValue();
    const QB = rawTxt;

    //NB
    [el] = await page.$x('//*[@id="new-brunswick-collapse"]/div[1]/p[1]');
    txt = await el.getProperty('textContent');
    rawTxt = await txt.jsonValue();
    const NB = rawTxt;

    //NS
    [el] = await page.$x('//*[@id="nova-scotia-collapse"]/div[1]/p[1]');
    txt = await el.getProperty('textContent');
    rawTxt = await txt.jsonValue();
    const NS = rawTxt;

    //PEI
    [el] = await page.$x('//*[@id="prince-edward-island-collapse"]/div[1]/p[1]');
    txt = await el.getProperty('textContent');
    rawTxt = await txt.jsonValue();
    const PEI = rawTxt;

    //NL
    [el] = await page.$x('//*[@id="newfoundland-and-labrador-collapse"]/div[1]/p[1]');
    txt = await el.getProperty('textContent');
    rawTxt = await txt.jsonValue();
    const NL = rawTxt;

    //Yukon
    [el] = await page.$x('//*[@id="yukon-collapse"]/div[1]/p[2]');
    txt = await el.getProperty('textContent');
    rawTxt = await txt.jsonValue();
    const YT = rawTxt;

    //NWT
    [el] = await page.$x('//*[@id="northwest-territories-collapse"]/div[1]/p[1]');
    txt = await el.getProperty('textContent');
    rawTxt = await txt.jsonValue();
    const NT = rawTxt;

    //NV
    [el] = await page.$x('//*[@id="nunavut-collapse"]/div[1]/p[1]');
    txt = await el.getProperty('textContent');
    rawTxt = await txt.jsonValue();
    const NU = rawTxt;
    

    const info = {"British Columbia": BC, "Alberta": AB, "Saskatchewan": SK, "Manitoba": MB, "Ontario": ON, "Quebec": QB, "New Brunswick": NB, "Nova Scotia": NS, "Prince Edward Island": PEI, "Newfoundland and Labrador": NL, "Yukon": YT, "Northwest Territories": NT, "Nunavut": NU}



    return info;
}

module.exports = scrapeCovid;
const puppeteer = require("puppeteer");
require("dotenv").config();
const url = "https://enlinea2023-2.uabcs.mx/login/";
const desktop = "https://enlinea2023-2.uabcs.mx/my/";
const scrapeLogic = async (res) => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        headless: true,
        args:[
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote"
        ],
        executablePath: 
        process.env.NODE_ENV === "production"
            ? process.env.PUPPETEER_EXCECUTABLE_PATH
            : puppeteer.executablePath(),
    });
    try{
    const page = await browser.newPage();
    
    await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36")
    
    await page.goto(url);

    const usernameInput = await page.$('input[name="username"]');
    await usernameInput.type('marcosignc_21');

    const passwordInput = await page.$('input[name="password"]');
    await passwordInput.type('sopitasprecio');

    await page.click('#loginbtn');

    await page.goto(desktop);
    //Obtener los links de cada clase
    /**/
    await page.waitForSelector('.card.dashboard-card');

    // Obtener los enlaces dentro del elemento con la clase "card dashboard-card"
    const links = await page.evaluate(() => {
      const divs = document.querySelectorAll('.card.dashboard-card');
      const urls = Array.from(divs)
      .map(div => Array.from(div.querySelectorAll('.aalink.coursename.mr-2'))
      .map(anchor => anchor.href))

      const names = Array.from(divs)
      .map(div => Array.from(div.querySelectorAll('.aalink.coursename.mr-2'))
      .map(anchor => anchor.querySelector('span.multiline').textContent))
      return {urls,names};
    });
    console.log(links.urls.at(0)[0]);
    await page.waitForSelector('.event-name-container');

    const tareaTitulo = await page.$$eval('.event-name-container', (elements) => {
            return elements.map((element) => element.innerText);
        });
    
    const tareasLinks = await page.$$eval('.event-name-container a', (anchors) => {
            return anchors.map((anchor) => anchor.getAttribute('href'));
        });
    const tareasTodo = {tareaTitulo, tareasLinks}
    console.log(tareasLinks);
    res.send(tareasTodo);
    }catch(e){
        console.log(e);
        res.send(`No se pueden cargar las materias ahora mismo, verifica que moodle esté funcionando o yo la cague jiji${e}`);
    } finally{
        await browser.close();
    }
}

module.exports={scrapeLogic}
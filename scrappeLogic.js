const puppeteer = require("puppeteer");
require("dotenv").config();
const url = "https://enlinea2023-2.uabcs.mx/login/";
const desktop = "https://enlinea2023-2.uabcs.mx/my/";
const scrapeLogic = async (res) => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
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
    await page.goto(url);

    const usernameInput = await page.$('input[name="username"]');
    await usernameInput.type('marcosignc_21');

    const passwordInput = await page.$('input[name="password"]');
    await passwordInput.type('sopitasprecio');

    await page.click('#loginbtn');

    await page.goto(desktop);
    //Obtener los links de cada clase
    /**/
    res.send("scrape");
    }catch(e){
        console.log(e);
        res.send(`No se pueden cargar las materias ahora mismo, verifica que moodle esté funcionando o yo la cague jiji${e}`);
    } finally{
        await browser.close();
    }
}

module.exports={scrapeLogic}
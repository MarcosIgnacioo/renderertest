const express = require("express");
const { scrapeLogic } = require("./scrappeLogic");
const app = express();

const PORT = process.env.PORT || 4000;
app.get("/", (req, res) => {
    res.send("Render pupp");
})
app.get("/oreo", (req, res) =>{
    scrapeLogic(res);
})
app.listen(PORT, () => {
    console.log(`Port: ${PORT}`);
});
// define the port we want to open this server on & its dependencies
const PORT = 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

// initialize using express
const app = express();

// make a global var
const articles = [];

// and now... the CRUD
app.get("/", (req, res) => {
  res.json("Welcome to my Climate Change News API");
});

// get articles = create scraper tool
app.get("/news", (req, res) => {
  axios
    .get("https://www.theguardian.com/environment/climate-crisis")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        articles.push({
          title,
          url,
        });
      });
      res.json(articles);
    })
    .catch((err) => console.log(err));
});

// get the port up and running
app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));

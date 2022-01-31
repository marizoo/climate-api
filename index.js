// define the port we want to open this server on & its dependencies
const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

// initialize using express
const app = express();

// an Array of sources
const newspapers = [
  {
    name: "cityam",
    address: "https://www.cityam.com/?s=tennis",
    base: "",
  },
  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/search?source=nav-desktop&q=tennis",
    base: "",
  },
  {
    name: "guardian",
    address: "https://www.theguardian.com/sport/tennis",
    base: "",
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/tennis/",
    base: "https://www.telegraph.co.uk",
  },
  {
    name: "nyt",
    address: "https://www.nytimes.com/search?query=tennis",
    base: "",
  },
  {
    name: "latimes",
    address: "https://www.latimes.com/search?q=tennis",
    base: "",
  },
  {
    name: "smh",
    address: "https://www.smh.com.au/sport/tennis",
    base: "https://www.smh.com.au",
  },
  {
    name: "un",
    address: "https://www.un.org/en/site-search?query=tennis",
    base: "",
  },
  {
    name: "bbc",
    address: "https://www.bbc.com/sport/tennis",
    base: "https://www.bbc.co.uk",
  },
  {
    name: "es",
    address: "https://www.standard.co.uk/sport/tennis",
    base: "https://www.standard.co.uk",
  },
  {
    name: "sun",
    address: "https://www.thesun.co.uk/sport/tennis/",
    base: "",
  },
  {
    name: "dm",
    address:
      "https://www.dailymail.co.uk/home/search.html?sel=site&searchPhrase=tennis",
    base: "",
  },
  {
    name: "nyp",
    address: "https://nypost.com/search/tennis/",
    base: "",
  },
];

// make a global var
const articles = [];

// we will loop the newspaper array
newspapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('a:contains("tennis")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    });
  });
});

// and now... the CRUD
app.get("/", (req, res) => {
  res.json("Welcome to my Tennis news API");
});

// get articles = create scraper tool
app.get("/news", (req, res) => {
  res.json(articles);
});

// make a root to get information from just 1 article
app.get("/news/:newspaperId", async (req, res) => {
  const newspaperId = req.params.newspaperId;
  //   console.log(req.params.newspaperId);

  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].address;

  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].base;

  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        specificArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperId,
        });
      });
      res.json(specificArticles);
    })
    .catch((err) => console.log(err));
});

// get the port up and running
app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));

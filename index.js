//Get all categories

// External dependencies
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const chalk = require("chalk");

const cat_url = "https://shop.countdown.co.nz/shop/";

const outputFile = "categories.json";

//Variables declaration
const parsedCategories = [];

let IDCount = 0;

//STEP 1

console.log(
  chalk.yellow.bgBlue(
    `\n  Scraping of ${chalk.underline.bold(cat_url)} initiated...\n`
  )
);

const getWebsiteContent = async cat_url => {
  try {
    const response = await axios.get(cat_url);
    const $ = cheerio.load(response.data);

    // New Lists
    $("#BrowseSlideBox a.toolbar-slidebox-link").map((i, el) => {
      category_url = "https://shop.countdown.co.nz" + $(el).attr("href");
      const count = IDCount++;
      const category_n = $(el)
        .text()
        .trim();
      const category = {
        category_id: count,
        category_name: category_n,
        url: category_url
      };
      parsedCategories.push(category);
    });

    exportResults(parsedCategories);
    return false;
  } catch (error) {
    exportResults(parsedCategories);
    console.error(error);
  }
};

const exportResults = parsedCategories => {
  fs.writeFile(outputFile, JSON.stringify(parsedCategories, null, 4), err => {
    if (err) {
      console.log(err);
    }
    console.log(
      chalk.yellow.bgBlue(
        `\n ${chalk.underline.bold(
          parsedCategories.length
        )} Results exported successfully to ${chalk.underline.bold(
          outputFile
        )}\n`
      )
    );
  });
};
getWebsiteContent(cat_url);

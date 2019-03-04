const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const chalk = require("chalk");
const _ = require("lodash");

const scrapProducts = async categories => {
  categories.forEach(async category => {
    let pageCounter = 0;
    let pageLimit = 1;
    const parsedProducts = [];

    const url = category.url + "?page=" + pageCounter;
    const response_p = await axios.get(url);

    const $ = cheerio.load(response_p.data);
    pageLimit = $("ul.paging.pull-left.hidden-phone")
      .find("li.page-number")
      .last()
      .find("a._jumpTop")
      .text()
      .trim();

    const pages = await Promise.all(
      [...Array(parseInt(pageLimit))].map(async (item, i) => {
        const p = i + 1;
        const pageUrl = category.url + "?page=" + p;
        const response = await axios.get(pageUrl);
        console.log(
          `Processing ${category.category_name}: ${i} out of ${pageLimit}`
        );
        if (!response.ok) {
          return null;
        }

        return parsePage(response, category, pageUrl);
      })
    );
    exportResults(category, pages);
  });
};

function parsePage(response, category, pageUrl) {
  //Scraping products
  const $ = cheerio.load(response.data);

  return $("div.gridProductStamp-product")
    .map((i, el) => {
      var offer_p = (offer_price = null);
      let unit = null;

      const name = $(el)
        .find("h3.gridProductStamp-name")
        .text()
        .trim();
      var normal_p = $(el)
        .find("div.gridProductStamp-price.din-medium")
        .text()
        .trim();

      if (normal_p != "") {
        normal_price = (normal_p.replace(/\D+/g, "") / 100).toFixed(2);
      } else {
        if (normal_p == "") {
          offer_p = $(el)
            .find("span.gridProductStamp-price.savings-text.din-medium")
            .text()
            .trim();
          normal_p = $(el)
            .find("span.gridProductStamp-subPrice")
            .text()
            .trim();
          offer_price = (offer_p.replace(/\D+/g, "") / 100).toFixed(2);
          normal_price = (normal_p.replace(/\D+/g, "") / 100).toFixed(2);
        }
      }
      return new Product(
        product_id = Math.random()
        .toString(36)
        .substr(2, 9),
        category.category_id,
        name,
        normal_price,
        offer_price,
        unit,
        pageUrl
      );
    })
    .get();
}

const exportResults = (category, pages) => {
  const fileName = `json/categories/${category.category_id}.json`;
  console.info(`Saving ${fileName}`);

  // We flatten the array because we ended up with an array of arrays
  fs.writeFile(fileName, JSON.stringify(_.flatten(pages), null, 4), err => {});
};

class Product {
  constructor(
    product_id,
    category_id,
    product_name,
    normal_price,
    offer_price,
    measure_unit,
    url
  ) {
    this.product_id = product_id;
    this.category_id = category_id;
    this.product_name = product_name;
    this.product_price = new ProductPrice(normal_price, offer_price);
    this.measure_unit = measure_unit;
    this.url = url;
  }
}

class ProductPrice {
  constructor(normal_price, offer_price) {
    this.normal_price = normal_price;
    this.offer_price = offer_price;
  }
}

module.exports = {
  scrapProducts: scrapProducts
};

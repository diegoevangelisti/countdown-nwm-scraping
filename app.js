//STEP 2

//Last scraping in categoty_id = 7
//Date 01/03

//Get all products

// External dependencies
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const chalk = require('chalk')

const outputFile_p = 'products_7.json'
const parsedProducts = []

var pageCounter = 0
var pageLimit = 1
var cat_data = require('./categories.json');
var categoryNumber = cat_data.length;
let IDCount = 3267;
var i = 7;

//Number of categories
console.log(chalk.yellow.bgBlue(`\n Number of categories obtained from file: ${categoryNumber}\n`))

//Get url to scrape
var pageurl = cat_data[i].url

console.log(chalk.yellow.bgBlue(`\n  Scraping of ${chalk.underline.bold(pageurl)} initiated...\n`))

async function getWebsiteContent_p(pageurl) {
    try {
        const response_p = await axios.get(pageurl)
        const $ = cheerio.load(response_p.data)

        if (pageCounter == 0) {
            pageLimit = $('ul.paging.pull-left.hidden-phone').find('li.page-number').last().find('a._jumpTop').text().trim()
            Number(pageLimit)
            console.log(chalk.yellow.bgBlue(`\n Number of pages: ${pageLimit}\n`))
        }

        //Scraping products
        $("div.gridProductStamp-product").map((i, el) => {
            count = IDCount++

            var offer_p = offer_price = null;
            let unit = null;

            const name = $(el).find("h3.gridProductStamp-name").text().trim()
            var normal_p = $(el).find("div.gridProductStamp-price.din-medium").text().trim()

            if (normal_p != "") {
                normal_price = (normal_p.replace(/\D+/g, '') / 100).toFixed(2);

            } else {
                if (normal_p == "") {

                    offer_p = $(el).find("span.gridProductStamp-price.savings-text.din-medium").text().trim()
                    normal_p = $(el).find("span.gridProductStamp-subPrice").text().trim()
                    offer_price = (offer_p.replace(/\D+/g, '') / 100).toFixed(2);
                    normal_price = (normal_p.replace(/\D+/g, '') / 100).toFixed(2);
                }
            }
            const product = {
                product_id: count,
                category_id: cat_data[i]._id,
                product_name: name,
                product_price: {
                    normal_price,
                    offer_price
                },
                measure_unit: unit,
                url: pageurl
            }
            parsedProducts.push(product)
        })

        pageCounter++

        if (pageCounter < pageLimit) {

            //Get next page link to continue scraping in the same category
            console.log(chalk.cyan(`  Scraping: ${pageurl}`))
            const nextPageLink = 'https://shop.countdown.co.nz' + $('ul.paging.pull-left.hidden-phone').children('li.next').find('a').attr('href')
            getWebsiteContent_p(nextPageLink)

        } else {
            //No more pages in the category
            console.log(chalk.cyan(`  Scraping: ${pageurl}`))
            exportResults(parsedProducts)
            pageCounter = 0;
            return false
        }

    } catch (error) {
        exportResults(parsedProducts)
        console.error(error)
    }
}

const exportResults = (parsedProducts) => {
fs.writeFile(outputFile_p, JSON.stringify(parsedProducts, null, 4), (err) => {
    if (err) {
        console.log(err)
    }
    console.log(chalk.yellow.bgBlue(`\n ${chalk.underline.bold(parsedProducts.length)} Results exported successfully to ${chalk.underline.bold(outputFile_p)}\n`))
})
}
getWebsiteContent_p(pageurl)
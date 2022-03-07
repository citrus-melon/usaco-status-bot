import * as cheerio from "cheerio";
import fetch from "node-fetch";

/**
 * @typedef {object} ContestStatus
 * @property {"ONGOING"|"RELEASED"|"GRADING"} type
 * @property {string} title Title of section on website, eg. "2022 February Contest"
 * @property {cheerio.Cheerio<cheerio.Element>} details First paragraph in section on website
 */

/**
 * Scrape http://usaco.org for current contest status
 */
export default async () => {
    const response = await fetch('http://usaco.org/');
    const text = await response.text()
    const $ = cheerio.load(text);

    const panel = $('div.content div.panel').first();
    const details = $('p', panel).first();
    const link = $('a', details);

    /** @type {ContestStatus} */
    const data = {
        title: $('h2', panel).text().trim(),
        details: details,
        type: null
    }

    if (link.length) { // There is a link
        const href = link.attr('href');
        if (href.endsWith('results')) { // Results are out
            data.type = "RELEASED";
        } else if (href.endsWith('viewcontest')) { // Contest is running
            data.type = "ONGOING";
        }
    } else { // There is no link
        data.type = "GRADING";
    }

    return data;
}
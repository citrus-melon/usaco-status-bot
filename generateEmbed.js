import * as cheerio from 'cheerio';
import { MessageEmbed } from 'discord.js';
import { URL } from 'url';

/** @typedef {import('./scrapeStatus.js').ContestStatus} ContestStatus */

/** 
 * @param {ContestStatus} status
 */
export default (status, lastUpdate) => {
    const embed = new MessageEmbed();
    embed.setTitle(status.title);
    embed.setAuthor({ name: "USACO Website", url: "http://usaco.org", iconURL: "https://usaco.guide/icons/icon-48x48.png" });

    const $details = cheerio.load(status.details.html(), null, false);
    for (const link of $details('a')) {
        const $link = $details(link);
        const absoluteHref = new URL($link.attr('href'), 'http://usaco.org/');
        $link.replaceWith(`[${$link.text()}](${absoluteHref})`);
    }
    embed.setDescription($details.text());
    
    if (status.type == "ONGOING") {
        embed.setFooter({ text: "Detected as: contest running" })
        embed.setColor('GREEN');
    } else if (status.type == "GRADING") {
        embed.setFooter({ text: "Detected as: results pending" })
        embed.setColor('ORANGE');
    } else if (status.type == "RELEASED") {
        embed.setFooter({ text: "Detected as: results released" })
        embed.setColor('BLUE');
    }

    if (lastUpdate) embed.setTimestamp(lastUpdate);

    return embed;
}
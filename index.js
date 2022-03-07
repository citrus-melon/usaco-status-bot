import * as Discord from "discord.js";
import Keyv from "keyv";
import commandHandler from "./commandHandler.js";
import generateEmbed from "./generateEmbed.js";
import scrapeStatus from "./scrapeStatus.js";

const data = new Keyv('sqlite://data.sqlite');

const client = new Discord.Client({
    intents: ["GUILDS"],
    presence: {activities: [{ name: "usaco.org", type: "WATCHING", url: "http://usaco.org" }]}
});

let currentStatus = {};

const checkChanges = async () => {
    const lastUpdate = Date.now()
    await data.set('lastUpdate', lastUpdate);
    
    const status = await scrapeStatus();
    currentStatus = status;
    const oldStatusType = await data.get('status');
    if (status.type == oldStatusType) return;
    await data.set('status', status.type);
    
    const embed = generateEmbed(status, lastUpdate);
    let caption;
    if (status.type == "ONGOING") caption = `**:green_circle: The ${status.title} has started!**`;
    else if (status.type == "GRADING") caption = `**:octagonal_sign: The ${status.title} has ended!**`;
    else if (status.type == "RELEASED") caption = `**:medal: Results are out for the ${status.title}!**`;

    const guildChannels = await data.get('guildChannels');
    for (const channelId of Object.values(guildChannels)) {
        try {
            if (!channelId) return;
            const channel = await client.channels.fetch(channelId);
            if (!channel.isText()) return;
            await channel.send({ content: caption, embeds: [embed] });
        } catch (error) {
            console.error(error);
        }
    }
}

const getCurrentStatus = () => currentStatus;

await client.login(process.env.BOT_TOKEN);
console.log(`Logged in as ${client.user.tag}!`);
await checkChanges();
commandHandler(client, data, checkChanges, getCurrentStatus);
setInterval(checkChanges, 600000);
console.log('Ready!');
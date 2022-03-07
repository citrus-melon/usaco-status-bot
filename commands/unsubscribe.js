import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Keyv from "keyv";

export const data = new SlashCommandBuilder()
    .setName('unsubscribe')
    .setDescription('Stop receiving USACO contest status updates')

/**
 * @param {CommandInteraction} interaction
 * @param {Keyv} data
 */
export const execute = async (interaction, data) => {
    if (!interaction.memberPermissions.has("MANAGE_WEBHOOKS")) return await interaction.reply("You need the `Manage Webhooks` permission to do this!");

    const guildChannels = await data.get('guildChannels');
    const oldChannelId = guildChannels[interaction.guild.id];
    delete guildChannels[interaction.guild.id];
    await data.set('guildChannels', guildChannels);
    if (oldChannelId) await interaction.reply(`USACO contest status updates will no longer be posted to <#${oldChannelId}>!`);
    else await interaction.reply('This server is already not receiving updates. Nothing changed.');
}
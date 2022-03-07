import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Keyv from "keyv";
import generateEmbed from "../generateEmbed.js";

/** @typedef {import('../scrapeStatus.js').ContestStatus} ContestStatus */

export const data = new SlashCommandBuilder()
    .setName('usacostatus')
    .setDescription('Get the current contest status from http://usaco.org')

/**
 * @param {CommandInteraction} interaction
 * @param {Keyv} data
 * @param {() => Promise} checkChanges
 * @param {() => ContestStatus} getCurrentStatus
 */
export const execute = async (interaction, data, checkChanges, getCurrentStatus) => {
    const lastUpdate = await data.get('lastUpdate')
    await interaction.deferReply();
    if (Date.now() - lastUpdate > 60000) {
        await checkChanges();
    }
    await interaction.editReply({embeds: [generateEmbed(getCurrentStatus(), lastUpdate)] });
}
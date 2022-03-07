import { SlashCommandBuilder, SlashCommandChannelOption } from "@discordjs/builders";
const { ChannelType } = await import('discord-api-types/v9');
import { CommandInteraction } from "discord.js";
import Keyv from "keyv";

export const data = new SlashCommandBuilder()
    .setName('setchannel')
    .setDescription('Set a channel to post USACO contest status updates')
    .addChannelOption(new SlashCommandChannelOption()
        .setName('channel')
        .setDescription('channel to post contest status updates to')
        .setRequired(false)
        .addChannelTypes([ChannelType.GuildNews, ChannelType.GuildText])
    )

/**
 * @param {CommandInteraction} interaction
 * @param {Keyv} data
 */
export const execute = async (interaction, data) => {
    if (!interaction.memberPermissions.has("MANAGE_WEBHOOKS")) return await interaction.reply("You need the `Manage Webhooks` permission to do this!");

    let channel = interaction.options.getChannel('channel') ?? interaction.channel;
    try { channel = await interaction.client.channels.fetch(channel.id); }
    catch { return await interaction.reply("Sorry, couldn't find that channel!"); }

    if (!(channel.type == "GUILD_TEXT" || channel.type == "GUILD_NEWS")) return await interaction.reply("Sorry, this type of channel isn't supported!");
    if (!channel.permissionsFor(interaction.client.user).has("SEND_MESSAGES")) return await interaction.reply("I don't have permission to send messages in that channel!");

    const guildChannels = await data.get('guildChannels') ?? {};
    guildChannels[interaction.guild.id] = channel.id;
    await data.set('guildChannels', guildChannels);
    await interaction.reply(`USACO contest status updates will now be posted to ${channel.toString()}!`);
}
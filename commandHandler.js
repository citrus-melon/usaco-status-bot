import { Collection, CommandInteraction } from "discord.js";
import fs from 'fs';

const commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = await import(`./commands/${file}`);
	commands.set(command.data.name, command);
}

export default (client, ...args) => {
    client.on('interactionCreate', /** @param {CommandInteraction} interaction */ async interaction => {
        if (!interaction.isCommand()) return;

        const command = commands.get(interaction.commandName);
        if (!command) return;

        try { await command.execute(interaction, ...args);
        } catch (error) {
            console.error(error);
            try {
                if (!interaction.replied) await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                else await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } catch (metaError) {console.error(metaError)}
        }
    });
}
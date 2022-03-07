import { readdirSync } from 'fs';
import { REST } from '@discordjs/rest';
const { Routes } = await import('discord-api-types/v9');

const commands = [];
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = await import(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

if (process.argv[3]) {
	rest.put(Routes.applicationGuildCommands(process.argv[2], process.argv[3]), { body: commands })
		.then(() => console.log('Successfully registered application commands.'))
		.catch(console.error);
} else {
	rest.put(Routes.applicationCommands(process.argv[2]), { body: commands })
		.then(() => console.log('Successfully registered application commands.'))
		.catch(console.error);
}


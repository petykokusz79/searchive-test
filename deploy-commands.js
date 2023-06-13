const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('fs');
const path = require('path');
const commandsPath = path.join(__dirname, 'commands');

const commands = [];
for (const file of fs.readdirSync(commandsPath)) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
const rest = new REST().setToken(token);
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} commands.`);
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);
		console.log(`Successfully reloaded ${data.length} commands.`);
	}
	catch (error) {
		console.error(error);
	}
})();
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const fs = require('fs');
const path = require('path');
const commandsPath = path.join(__dirname, 'commands');

client.once(Events.ClientReady, c => {
	console.log(`Logged in as ${c.user.tag}.`);
});

client.commands = new Collection();
for (const file of fs.readdirSync(commandsPath)) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
	else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

async function tryExec(interaction, execute) {
	try {
		await execute(interaction);
	}
	catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		}
		else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isStringSelectMenu()) {
		await tryExec(interaction, async interaction => {
			let choices = '';
			await interaction.values.forEach(async value => {
				choices += value;
			});
			await interaction.reply({ content: choices });
			await interaction.message.delete();
		});
		return;
	}
	const command = (
		interaction.isChatInputCommand() ||
		interaction.isMessageContextMenuCommand() ||
		interaction.isStringSelectMenu()
		) && interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	await tryExec(interaction, command.execute);
});

client.login(token);
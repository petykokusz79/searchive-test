const { ApplicationCommandType, ContextMenuCommandBuilder } = require('discord.js');
const { messageUrlFormat } = require('../config.json');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('get message link')
		.setType(ApplicationCommandType.Message),
	async execute(interaction) {
		await interaction.reply({
			content: messageUrlFormat
				.replace('GUILD', interaction.guildId)
				.replace('CHANNEL', interaction.channelId)
				.replace('MESSAGE', interaction.targetId),
			ephemeral: true
		});
	}
};
const { ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('select')
		.setDescription('Shows a multi-select menu of strings and deletes it after selection'),
	async execute(interaction) {
		const select = new StringSelectMenuBuilder()
			.setCustomId('select')
			.setPlaceholder('Select some elements')
			.setMinValues(1)
			.setMaxValues(3)
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('A')
					.setValue('a'),
				new StringSelectMenuOptionBuilder()
					.setLabel('B')
					.setValue('b'),
				new StringSelectMenuOptionBuilder()
					.setLabel('C')
					.setValue('c'),
			);
		const row = new ActionRowBuilder()
			.addComponents(select);
		await interaction.reply({
			//content: '',
			components: [row]
		});
	}
};
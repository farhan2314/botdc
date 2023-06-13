const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
      .setDescription('Unban a member')
      .addStringOption(option => option.setName('target')
        .setDescription('The member to unban')
        .setRequired(true)),
  async execute(interaction) {
    const target = interaction.options.getUser('target');

    const user = interaction.options.getUser('target');
    guild.members.unban(user);

    await interaction.reply(`Successfully unbanned ${target}.`);
  },
};

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot\'s ping.'),
  async execute(interaction) {
    const startTime = Date.now();
    const reply = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    const endTime = Date.now();
    const latency = endTime - startTime;

    interaction.editReply(`Pong! Bot latency: ${latency}ms, API latency: ${reply.createdTimestamp - interaction.createdTimestamp}ms`);
  },
};
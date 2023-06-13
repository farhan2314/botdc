const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Dapatkan URL avatar dari pengguna yang dipilih atau avatar Anda sendiri.')
    .addUserOption(option => option.setName('target').setDescription('Avatar pengguna yang akan ditampilkan')),
  async execute(interaction) {
    const user = interaction.options.getUser('target');
    const avatarURL = user ? user.displayAvatarURL({ dynamic: true, format: 'png' }) : interaction.user.displayAvatarURL({ dynamic: true, format: 'png' });

    await interaction.reply({
      content: `${user ? `${user.username}'s` : 'Your'} avatar:`,
      files: [avatarURL],
    });
  },
};
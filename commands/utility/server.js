const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Menampilkan informasi tentang server ini.'),
  async execute(interaction) {
    const guild = interaction.guild;
    const roles = guild.roles.cache.map(role => role.name).join(', ');
    const rolesCount = guild.roles.cache.size;
    const totalChannels = guild.channels.cache.filter(channel => channel.type !== 'GUILD_CATEGORY').size;
    
    const embed = {
      title: 'Informasi Server',
      color: 0xa53e76,
      fields: [
        { name: 'Nama Server', value: guild.name },
        { name: 'Total Anggota', value: guild.memberCount.toString() },
        { name: 'Jumlah Roles', value: rolesCount.toString() },
        { name: 'Total Channel', value: totalChannels.toString() },
        { name: 'Roles', value: roles },
      ]
    };

    return interaction.reply({ embeds: [embed] });
	
  },
};
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Select a member and ban them.')
    .addUserOption(option => option.setName('target').setDescription('The member to ban').setRequired(true))
    .addStringOption(option => 
      option.setName('duration')
        .setDescription('Ban duration')
        .setRequired(true)
        .addChoices(
          { name: '1 hour', value: '1h' },
          { name: '24 hours', value: '24h' },
          { name: '7 days', value: '7d' },
          { name: '30 days', value: '30d' }
        )
    )
    .addStringOption(option => option.setName('reason').setDescription('Reason for the ban').setRequired(false)),
  async execute(interaction) {
    const target = interaction.options.getUser('target').value;
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const duration = interaction.options.getString('duration');

    const confirm = new ButtonBuilder()
      .setCustomId('confirm')
      .setLabel('Confirm Ban')
      .setStyle(ButtonStyle.Danger);

    const cancel = new ButtonBuilder()
      .setCustomId('cancel')
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(false);

    const row = new ActionRowBuilder()
      .addComponents(cancel, confirm);

    await interaction.reply({
      content: `Are you sure you want to ban ${target} for reason: ${reason} and duration: ${duration}?`,
      components: [row],
    });

    const collector = interaction.channel.createMessageComponentCollector({
      time: 60000,
      filter: (i) => i.customId === 'confirm' || i.customId === 'cancel',
    });

    collector.on('collect', async (i) => {
      if (i.customId === 'confirm') {
        await i.update({
          content: `Ban confirmed for ${target} with reason: ${reason} and duration: ${duration}`,
          components: [],
        });

        const banDuration = ms(duration);

        await interaction.guild.members.ban(target, {
          reason,
          days: Math.floor(banDuration / 86400000), 
        });
      } else if (i.customId === 'cancel') {
        await i.update({
          content: `Ban canceled for ${target}`,
          components: [],
        });
      }
    });

    collector.on('end', () => {
      interaction.deleteReply();  
    });
  },
};
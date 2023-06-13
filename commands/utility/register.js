const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('memperkenalkan')
    .setDescription('Untuk memperkenalkan diri.'),

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('Introduce')
      .setTitle('Perkenalkan diri Anda');

    const nama = new TextInputBuilder()
      .setCustomId('nameInput')
      .setLabel('Siapa namamu?')
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const asal = new TextInputBuilder()
      .setCustomId('asalInput')
      .setLabel('Berapa umurmu?')
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const hobi = new TextInputBuilder()
      .setCustomId('hobiInput')
      .setLabel('Apa hobimu?')
      .setRequired(false)
      .setStyle(TextInputStyle.Paragraph);

    const pekerjaan = new TextInputBuilder()
      .setCustomId('pekerjaanInput')
      .setLabel('Apa pekerjaanmu?')
      .setRequired(false)
      .setStyle(TextInputStyle.Short);

    const components = [nama, asal, hobi, pekerjaan];
    modal.addComponents(new ActionRowBuilder().addComponents(components));

    await interaction.showModal(modal);
  },
};
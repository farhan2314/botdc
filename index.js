const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, SlashCommandBuilder, MessageEmbed } = require('discord.js');
const pingCommand = require('./commands/fun/ping');
const { ActivityType } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config()
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.modals = new Collection();
client.cooldowns = new Collection();
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
const token = process.env.DISCORD_TOKEN;

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, () => {
	console.log('Ready!');
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	const { cooldowns } = client;

	if (!cooldowns.has(command.data.name)) {
		cooldowns.set(command.data.name, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.data.name);
	const defaultCooldownDuration = 3;
	const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

	if (timestamps.has(interaction.user.id)) {
		const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

		if (now < expirationTime) {
			const expiredTimestamp = Math.round(expirationTime / 1000);
			return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
		}
	}

	timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'submit') {
    const submittedEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Formulir Pendaftaran Diterima')
      .setDescription('Terima kasih atas pendaftaran Anda!')
      .addField('Nama', interaction.message.embeds[0].fields[0].value)
      .addField('Tanggal Lahir', interaction.message.embeds[0].fields[1].value)
      .addField('Tempat Lahir', interaction.message.embeds[0].fields[2].value)
      .addField('Kelas', interaction.message.embeds[0].fields[3].value);

    await interaction.update({ embeds: [submittedEmbed], components: [] });

    const member = interaction.member;
    const role = interaction.guild.roles.cache.find(role => role.name === 'Role Khusus');
    if (role) {
      await member.roles.add(role);
    }
  }
});

client.commands = new Map();
client.commands.set('ping', pingCommand);

client.login(token);
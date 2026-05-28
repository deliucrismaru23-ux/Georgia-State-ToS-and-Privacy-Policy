require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle
} = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ======================
// COMMANDS
// ======================
const commands = [
  new SlashCommandBuilder()
    .setName('ad')
    .setDescription('Posts the server advertisement'),

  new SlashCommandBuilder()
    .setName('partnership-requirements')
    .setDescription('Shows partnership requirements')
].map(command => command.toJSON());

// ======================
// REGISTER COMMANDS
// ======================
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

async function registerCommands() {
  try {
    console.log('Registering commands...');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('Commands registered!');
  } catch (error) {
    console.error(error);
  }
}

// ======================
// READY
// ======================
client.once('ready', async () => {
  console.log(`${client.user.tag} is online!`);

  await registerCommands();
});

// ======================
// INTERACTIONS
// ======================
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // /ad
  if (interaction.commandName === 'ad') {

    const embed = new EmbedBuilder()
      .setTitle('🚔 Georgia State Roleplay')
      .setDescription(`
🔥 Welcome to Georgia State Roleplay!

✅ Active Staff
✅ Daily Roleplays
✅ CAD / MDT
✅ Departments
✅ Professional Community

🎮 Join today!
`)
      .setColor('Blue');

    const button = new ButtonBuilder()
      .setLabel('Join Server')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.gg/38CUPBaW');

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }

  // /partnership-requirements
  if (interaction.commandName === 'partnership-requirements') {

    const embed = new EmbedBuilder()
      .setTitle('🤝 Partnership Requirements')
      .setDescription(`
✅ 50+ Members = 1 Representative
✅ 50- Members = 2 Representatives
✅ Active Community
✅ Professional Staff
✅ Must Advertise Our Server
`)
      .setColor('Purple');

    await interaction.reply({
      embeds: [embed]
    });
  }
});

// ======================
// LOGIN
// ======================
client.login(process.env.TOKEN);

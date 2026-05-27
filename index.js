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

// =========================
// SLASH COMMAND
// =========================
const commands = [
  new SlashCommandBuilder()
    .setName('ad')
    .setDescription('Posts the server advertisement')
].map(c => c.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

async function registerCommands() {
  try {
    console.log("Registering slash commands...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("Slash commands registered successfully!");
  } catch (err) {
    console.error("Command registration failed:", err);
  }
}

registerCommands();
  }
})();

// =========================
// BOT READY
// =========================

client.once('ready', () => {
  console.log(`${client.user.tag} is online!`);
});

// =========================
// COMMAND HANDLER
// =========================

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ad') {

    const embed = new EmbedBuilder()
      .setTitle('🚔 Georgia State Roleplay')
      .setDescription(
`🔥 **Hello! Welcome to Georgia State Roleplay!**
We are a new and realistic roleplay server.

**What we have to offer!**
✅ Active Staff
✅ Daily Roleplays
✅ CAD/MDT
✅ Departments
✅ Professional Community

📢 Join today and start roleplaying!

**What we are looking for?**
✅ You!
✅ Donations to help the server grow!
✅ New staff!
✅ New members!
✅ Boosters!`
      )
      .setColor('Blue')
      .setThumbnail(interaction.guild.iconURL())
      .setFooter({
        text: 'Georgia State Roleplay'
      })
      .setTimestamp();

    const button = new ButtonBuilder()
      .setLabel('Join Server')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.gg/q9vnWpgS');

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
});

client.login(process.env.TOKEN);

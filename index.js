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
// SLASH COMMAND SETUP
// =========================
const commands = [
  new SlashCommandBuilder()
    .setName('ad')
    .setDescription('Posts the server advertisement')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// =========================
// REGISTER COMMANDS
// =========================
async function registerCommands() {
  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log('Slash commands registered successfully!');
  } catch (error) {
    console.error(error);
  }
}

// =========================
// BOT READY
// =========================
client.once('ready', async () => {
  console.log(`${client.user.tag} is online!`);

  await registerCommands();
});

// =========================
// COMMAND HANDLER
// =========================
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ad') {

    const embed = new EmbedBuilder()
      .setTitle('🚔 Georgia State Roleplay')
      .setDescription(`
🔥 **Hello! Welcome to Georgia State Roleplay!**
We are a new and realistic ER:LC roleplay server.

━━━━━━━━━━━━━━━━━━

## ✅ What We Offer
🚓 Active Staff  
📅 Daily Roleplays  
💻 CAD / MDT  
👮 Multiple Departments  
🌎 Professional Community  
🎉 Friendly Members  
🚨 Realistic Scenarios  

━━━━━━━━━━━━━━━━━━

## 📢 We Are Looking For
✅ New Members  
✅ Staff Members  
✅ Boosters  
✅ Department Leaders  
✅ Active Roleplayers  

━━━━━━━━━━━━━━━━━━

🎮 Join today and start your RP journey with us!
`)
      .setColor('Blue')
      .setThumbnail(interaction.guild.iconURL())
      .setFooter({
        text: 'Georgia State Roleplay'
      })
      .setTimestamp();

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
});

// =========================
// LOGIN
// =========================
client.login(process.env.TOKEN);

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
// SLASH COMMANDS
// ======================
const commands = [

  // /ad
  new SlashCommandBuilder()
    .setName('ad')
    .setDescription('Posts the server advertisement'),

  // /partnership-requirements
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
// READY EVENT
// ======================
client.once('clientReady', async () => {
  console.log(`${client.user.tag} is online!`);

  await registerCommands();
});

// ======================
// INTERACTION HANDLER
// ======================
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // ======================
  // /ad
  // ======================
  if (interaction.commandName === 'ad') {

    const embed = new EmbedBuilder()
      .setTitle('🚔 Georgia State Roleplay')
      .setDescription(`🚨🔥 GEORGIA STATE ROLEPLAY 🔥🚨
The Ultimate ER:LC Roleplay Experience on Roblox

━━━━━━━━━━━━━━━━━━━━━━━━━━

🌟 Looking for realistic, action-packed roleplay?
Join one of the fastest-growing Georgia-based ER:LC communities and experience professional, immersive emergency services roleplay like never before!

💎 WHY PLAYERS CHOOSE US

🚓 Active & Professional Staff Team
👮 Multiple Departments Available
• Law Enforcement
• EMS
• Fire Rescue
• DOT
• Coast Guard
• And More!

🎨 Custom Liveries, Uniforms & Vehicles
📅 Daily Roleplay Sessions & Community Events
🚨 Realistic Scenarios & Procedures
🤝 Friendly, Mature & Welcoming Community
⭐ Professional Standards Without the Toxicity

━━━━━━━━━━━━━━━━━━━━━━━━━━

📢 WE'RE RECRUITING NOW!

🔥 Active Roleplayers
Ready to create amazing scenarios and build unforgettable experiences.

👑 Department Leadership
Lead, inspire, and help shape the future of our server.

🛡️ Staff Team Members
Help maintain a fun, fair, and professional environment.

💜 Server Boosters
Exclusive rewards and recognition available for boosters!

━━━━━━━━━━━━━━━━━━━━━━━━━━

🚔 YOUR SHIFT STARTS HERE 🚔

Whether you're enforcing the law, saving lives, fighting fires, or keeping Georgia's roads moving, there's a place for you in our community.

🎯 Join today and become part of Georgia's premier ER:LC roleplay server!

━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥 Professional Roleplay • Realistic Scenarios • Active Community • Endless Opportunities 🔥`)
      .setColor('Blue');

    const button = new ButtonBuilder()
      .setLabel('Join Server')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.gg/8pcKgp7uR');

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }

  // ======================
  // /partnership-requirements
  // ======================
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

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
      .setDescription(`🔥 Welcome to Georgia State Roleplay!

We are a realistic and professional ER:LC roleplay community looking for active members to help grow our server!

━━━━━━━━━━━━━━━━━━

## 🌟 What We Offer
✅ Active & Professional Staff  
✅ Daily Roleplays  
✅ Custom Liveries  
✅ Custom Uniforms  
✅ Realistic Departments  
✅ Friendly Community  
✅ Organized Server  
✅ High Quality Roleplay  
✅ Fun & Active Members  

━━━━━━━━━━━━━━━━━━

## 👮 Departments
🚓 Law Enforcement  
🚑 Fire & EMS  
🚗 Civilian Operations  
📻 DOT  

━━━━━━━━━━━━━━━━━━

## 📢 We Are Hiring!
✅ Staff Members  
✅ Department Leadership  
✅ Moderators  
✅ Active Roleplayers  

━━━━━━━━━━━━━━━━━━

🎮 Join Georgia State Roleplay today and become part of an amazing ER:LC community!`)
      .setColor('Blue');

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

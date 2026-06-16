require('dotenv').config();
const {
    Client,
    GatewayIntentBits,
    PermissionsBitField,
    EmbedBuilder,
    SlashCommandBuilder,
    REST,
    Routes,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType
} = require('discord.js');

const sqlite3 = require('sqlite3').verbose();

// =====================
// CLIENT
// =====================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration
    ]
});

// =====================
// DATABASE
// =====================

const db = new sqlite3.Database('./database.sqlite');

db.run(`
CREATE TABLE IF NOT EXISTS warnings (
id INTEGER PRIMARY KEY AUTOINCREMENT,
userId TEXT,
moderatorId TEXT,
reason TEXT,
timestamp INTEGER
)
`);
// =====================
// TICKET CONFIG
// =====================

const TICKET_CATEGORY_ID =
'1511483863375806584';

const STAFF_ROLE_ID =
'1501277018984284200';

// =====================
// SLASH COMMANDS
// =====================

const commands = [

new SlashCommandBuilder()
.setName('ping')
.setDescription('Check bot latency'),

new SlashCommandBuilder()
.setName('ban')
.setDescription('Ban a member')
.addUserOption(option =>
option
.setName('user')
.setDescription('User to ban')
.setRequired(true))
.addStringOption(option =>
option
.setName('reason')
.setDescription('Reason for ban')),

new SlashCommandBuilder()
.setName('kick')
.setDescription('Kick a member')
.addUserOption(option =>
option
.setName('user')
.setDescription('User to kick')
.setRequired(true))
.addStringOption(option =>
option
.setName('reason')
.setDescription('Reason for kick')),

new SlashCommandBuilder()
.setName('timeout')
.setDescription('Timeout a member')
.addUserOption(option =>
option
.setName('user')
.setDescription('User')
.setRequired(true))
.addIntegerOption(option =>
option
.setName('minutes')
.setDescription('Minutes')
.setRequired(true))
.addStringOption(option =>
option
.setName('reason')
.setDescription('Reason')),

new SlashCommandBuilder()
.setName('untimeout')
.setDescription('Remove timeout')
.addUserOption(option =>
option
.setName('user')
.setDescription('User')
.setRequired(true)),

new SlashCommandBuilder()
.setName('warn')
.setDescription('Warn a member')
.addUserOption(option =>
option
.setName('user')
.setDescription('User')
.setRequired(true))
.addStringOption(option =>
option
.setName('reason')
.setDescription('Reason')
.setRequired(true)),

new SlashCommandBuilder()
.setName('warnings')
.setDescription('View warnings')
.addUserOption(option =>
option
.setName('user')
.setDescription('User')
.setRequired(true)),

new SlashCommandBuilder()
.setName('clear')
.setDescription('Delete messages')
.addIntegerOption(option =>
option
.setName('amount')
.setDescription('Amount')
.setRequired(true)),

new SlashCommandBuilder()
.setName('ticket-panel')
.setDescription('Send the ticket panel'),

new SlashCommandBuilder()
.setName('close-ticket')
.setDescription('Close the current ticket'),
  ].map(command => command.toJSON());

// =====================
// REGISTER COMMANDS
// =====================

const rest = new REST({
version: '10'
}).setToken(process.env.TOKEN);

async function registerCommands() {

try {

console.log('Registering commands...');

await rest.put(
Routes.applicationGuildCommands(
  process.env.CLIENT_ID,
  process.env.GUILD_ID
)
),
{
body: commands
}
);

console.log('Commands registered.');

} catch (error) {

console.error(error);

}
}// =====================
// READY EVENT
// =====================

client.once('clientReady', async () => {
console.log(
`✅ ${client.user.tag} online`
);

await registerCommands();

});// =====================
// INTERACTION HANDLER
// =====================

client.on('interactionCreate', async interaction => {

if (!interaction.isChatInputCommand()) return;

// =====================
// PING
// =====================

if (interaction.commandName === 'ping') {

return interaction.reply({
embeds: [
new EmbedBuilder()
.setTitle('🏓 Pong!')
.setDescription(
`Latency: ${client.ws.ping}ms`
)
.setColor('Green')
]
});

}

// =====================
// BAN
// =====================

if (interaction.commandName === 'ban') {

if (
!interaction.member.permissions.has(
PermissionsBitField.Flags.BanMembers
)
) {
return interaction.reply({
content:
'❌ You do not have permission.',
ephemeral: true
});
}

const user =
interaction.options.getUser('user');

const reason =
interaction.options.getString('reason') ||
'No reason provided';

const member =
interaction.guild.members.cache.get(
user.id
);

if (!member) {
return interaction.reply({
content: '❌ User not found.',
ephemeral: true
});
}

try {

await member.ban({
reason
});

const embed = new EmbedBuilder()
.setTitle('🔨 Member Banned')
.addFields(
{
name: 'User',
value: `${user.tag}`
},
{
name: 'Moderator',
value: `${interaction.user.tag}`
},
{
name: 'Reason',
value: reason
}
)
.setColor('Red')
.setTimestamp();

return interaction.reply({
embeds: [embed]
});

} catch (err) {

console.error(err);

return interaction.reply({
content:
'❌ Failed to ban user.',
ephemeral: true
});

}
}

// =====================
// KICK
// =====================

if (interaction.commandName === 'kick') {

if (
!interaction.member.permissions.has(
PermissionsBitField.Flags.KickMembers
)
) {
return interaction.reply({
content:
'❌ You do not have permission.',
ephemeral: true
});
}

const user =
interaction.options.getUser('user');

const reason =
interaction.options.getString('reason') ||
'No reason provided';

const member =
interaction.guild.members.cache.get(
user.id
);

if (!member) {
return interaction.reply({
content:
'❌ User not found.',
ephemeral: true
});
}

try {

await member.kick(reason);

const embed = new EmbedBuilder()
.setTitle('👢 Member Kicked')
.addFields(
{
name: 'User',
value: user.tag
},
{
name: 'Moderator',
value:
interaction.user.tag
},
{
name: 'Reason',
value: reason
}
)
.setColor('Orange')
.setTimestamp();

return interaction.reply({
embeds: [embed]
});

} catch (err) {

console.error(err);

return interaction.reply({
content:
'❌ Failed to kick member.',
ephemeral: true
});

}
}

// =====================
// TIMEOUT
// =====================

if (
interaction.commandName === 'timeout'
) {

if (
!interaction.member.permissions.has(
PermissionsBitField.Flags.ModerateMembers
)
) {
return interaction.reply({
content:
'❌ You do not have permission.',
ephemeral: true
});
}

const user =
interaction.options.getUser('user');

const minutes =
interaction.options.getInteger(
'minutes'
);

const reason =
interaction.options.getString('reason') ||
'No reason provided';

const member =
interaction.guild.members.cache.get(
user.id
);

if (!member) {
return interaction.reply({
content:
'❌ User not found.',
ephemeral: true
});
}

try {

await member.timeout(
minutes * 60 * 1000,
reason
);

const embed = new EmbedBuilder()
.setTitle('⏳ Member Timed Out')
.addFields(
{
name: 'User',
value: user.tag
},
{
name: 'Duration',
value:
`${minutes} minute(s)`
},
{
name: 'Reason',
value: reason
}
)
.setColor('Yellow')
.setTimestamp();

return interaction.reply({
embeds: [embed]
});

} catch (err) {

console.error(err);

return interaction.reply({
content:
'❌ Failed to timeout member.',
ephemeral: true
});

}
}

// =====================
// UNTIMEOUT
// =====================

if (
interaction.commandName === 'untimeout'
) {

if (
!interaction.member.permissions.has(
PermissionsBitField.Flags.ModerateMembers
)
) {
return interaction.reply({
content:
'❌ You do not have permission.',
ephemeral: true
});
}

const user =
interaction.options.getUser('user');

const member =
interaction.guild.members.cache.get(
user.id
);

if (!member) {
return interaction.reply({
content:
'❌ User not found.',
ephemeral: true
});
}

try {

await member.timeout(null);

const embed = new EmbedBuilder()
.setTitle('✅ Timeout Removed')
.addFields(
{
name: 'User',
value: user.tag
},
{
name: 'Moderator',
value:
interaction.user.tag
}
)
.setColor('Green')
.setTimestamp();

return interaction.reply({
embeds: [embed]
});

} catch (err) {

console.error(err);

return interaction.reply({
content:
'❌ Failed to remove timeout.',
ephemeral: true
});

}
}// =====================
// WARN
// =====================

if (interaction.commandName === 'warn') {

if (
!interaction.member.permissions.has(
PermissionsBitField.Flags.ModerateMembers
)
) {
return interaction.reply({
content:
'❌ You do not have permission.',
ephemeral: true
});
}

const user =
interaction.options.getUser('user');

const reason =
interaction.options.getString('reason');

db.run(
`INSERT INTO warnings
(userId, moderatorId, reason, timestamp)
VALUES (?, ?, ?, ?)`,
[
user.id,
interaction.user.id,
reason,
Date.now()
]
);

const embed = new EmbedBuilder()
.setTitle('⚠️ User Warned')
.addFields(
{
name: 'User',
value: user.tag
},
{
name: 'Moderator',
value: interaction.user.tag
},
{
name: 'Reason',
value: reason
}
)
.setColor('Yellow')
.setTimestamp();

return interaction.reply({
embeds: [embed]
});

}

// =====================
// WARNINGS
// =====================

if (
interaction.commandName === 'warnings'
) {

const user =
interaction.options.getUser('user');

db.all(
`SELECT * FROM warnings
WHERE userId = ?`,
[user.id],
async (err, rows) => {

if (err) {
console.error(err);

return interaction.reply({
content:
'❌ Database error.',
ephemeral: true
});
}

if (!rows.length) {

return interaction.reply({
embeds: [
new EmbedBuilder()
.setTitle(
'📋 Warning History'
)
.setDescription(
`${user.tag} has no warnings.`
)
.setColor('Green')
]
});

}

let warningText = '';

rows.forEach((warning, index) => {

warningText +=
`**${index + 1}.** ${warning.reason}\n`;

});

const embed = new EmbedBuilder()
.setTitle(
`📋 Warnings for ${user.tag}`
)
.setDescription(warningText)
.setColor('Orange')
.setTimestamp();

return interaction.reply({
embeds: [embed]
});

});

}

// =====================
// CLEAR
// =====================

if (interaction.commandName === 'clear') {

if (
!interaction.member.permissions.has(
PermissionsBitField.Flags.ManageMessages
)
) {

return interaction.reply({
content:
'❌ You do not have permission.',
ephemeral: true
});

}

const amount =
interaction.options.getInteger(
'amount'
);

if (amount < 1 || amount > 100) {

return interaction.reply({
content:
'❌ Amount must be between 1 and 100.',
ephemeral: true
});

}

try {

await interaction.channel.bulkDelete(
amount,
true
);

const embed = new EmbedBuilder()
.setTitle('🧹 Messages Cleared')
.setDescription(
`Deleted ${amount} messages.`
)
.setColor('Blue');

return interaction.reply({
embeds: [embed],
ephemeral: true
});

} catch (err) {

console.error(err);

return interaction.reply({
content:
'❌ Failed to delete messages.',
ephemeral: true
});

}

}
// =====================
// TICKET PANEL
// =====================

if (
interaction.commandName ===
'ticket-panel'
) {

if (
!interaction.member.permissions.has(
PermissionsBitField.Flags.ManageChannels
)
) {
return interaction.reply({
content:
'❌ Missing permissions.',
ephemeral: true
});
}

const embed = new EmbedBuilder()
.setTitle('🎫 Support Tickets')
.setDescription(
'Press the button below to open a support ticket.'
)
.setColor('Blue');

const button =
new ButtonBuilder()
.setCustomId('create_ticket')
.setLabel('Create Ticket')
.setStyle(ButtonStyle.Success);

const row =
new ActionRowBuilder()
.addComponents(button);

return interaction.reply({
embeds: [embed],
components: [row]
});

}
// =====================
// CLOSE TICKET COMMAND
// =====================

if (
interaction.commandName ===
'close-ticket'
) {

if (
!interaction.channel.name.startsWith(
'ticket-'
)
) {

return interaction.reply({
content:
'❌ This is not a ticket.',
ephemeral: true
});

}

await interaction.reply(
'🔒 Closing ticket in 5 seconds...'
);

setTimeout(async () => {

try {

await interaction.channel.delete();

} catch (err) {

console.error(err);

}

}, 5000);

return;

}
// =====================
// UNKNOWN COMMAND
// =====================

return interaction.reply({
content: '❌ Command not found.',
ephemeral: true
});

});

// =====================
// ERROR HANDLING
// =====================

process.on(
'unhandledRejection',
error => {
console.error(error);
}
);

process.on(
'uncaughtException',
error => {
console.error(error);
}
);
// =====================
// BUTTONS
// =====================

client.on(
'interactionCreate',
async interaction => {

if (!interaction.isButton())
return;

// =====================
// CREATE TICKET
// =====================

if (
interaction.customId ===
'create_ticket'
) {

const existing =
interaction.guild.channels.cache.find(
channel =>
channel.name ===
`ticket-${interaction.user.id}`
);

if (existing) {

return interaction.reply({
content:
`❌ You already have a ticket: ${existing}`,
ephemeral: true
});

}

const channel =
await interaction.guild.channels.create(
{
name:
`ticket-${interaction.user.id}`,
type: ChannelType.GuildText,
parent: TICKET_CATEGORY_ID,

permissionOverwrites: [

{
id:
interaction.guild.id,
deny:
['ViewChannel']
},

{
id:
interaction.user.id,
allow: [
'ViewChannel',
'SendMessages',
'ReadMessageHistory'
]
},

{
id:
STAFF_ROLE_ID,
allow: [
'ViewChannel',
'SendMessages',
'ReadMessageHistory'
]
}

]
}
);

const closeButton =
new ButtonBuilder()
.setCustomId(
'close_ticket_button'
)
.setLabel('Close Ticket')
.setStyle(
ButtonStyle.Danger
);

const row =
new ActionRowBuilder()
.addComponents(closeButton);

const embed =
new EmbedBuilder()
.setTitle('🎫 Ticket Created')
.setDescription(
'Please describe your issue and wait for staff.'
)
.setColor('Green');

await channel.send({
content:
`<@${interaction.user.id}>`,
embeds: [embed],
components: [row]
});

await interaction.reply({
content:
`✅ Ticket created: ${channel}`,
ephemeral: true
});

}

// =====================
// CLOSE BUTTON
// =====================

if (
interaction.customId ===
'close_ticket_button'
) {

await interaction.reply(
'🔒 Closing ticket in 5 seconds...'
);

setTimeout(async () => {

try {

await interaction.channel.delete();

} catch (err) {

console.error(err);

}

}, 5000);

}

});
// =====================
// LOGIN
// =====================
console.log("TOKEN EXISTS:", !!process.env.TOKEN);
client.login(process.env.TOKEN);

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ad') {
    try {

      const embed = new EmbedBuilder()
        .setTitle('🚔 Georgia State Roleplay')
        .setDescription(`🔥 Welcome to Georgia State Roleplay!

✅ Active Staff
✅ Daily Roleplays
✅ CAD/MDT
✅ Departments
✅ Professional Community`)
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

    } catch (error) {
      console.error(error);

      if (!interaction.replied) {
        await interaction.reply({
          content: 'Command failed.',
          ephemeral: true
        });
      }
    }
  }
});

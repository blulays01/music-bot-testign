require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadCommands } = require('./src/handler');
const { initSpotify } = require('./src/spotify');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.queues = new Map();

loadCommands(client);

client.once('clientReady', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  client.user.setActivity('🎵 /play to start music!');
});

// ── Slash commands ──────────────────────────────────────────────────────────
client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`Command error: ${error.message}`);
      const msg = { content: '❌ An error occurred!', ephemeral: true };
      if (interaction.replied || interaction.deferred) await interaction.followUp(msg);
      else await interaction.reply(msg);
    }
    return;
  }

  // ── Button interactions ───────────────────────────────────────────────────
  if (interaction.isButton()) {
    const queue = client.queues.get(interaction.guildId);

    // Silently ignore clicks on already-disabled buttons
    if (interaction.customId.startsWith('disabled_')) {
      return interaction.reply({ content: '⚠️ No music is playing.', ephemeral: true });
    }

    if (!queue || !queue.playing) {
      return interaction.reply({ content: '❌ Nothing is playing right now!', ephemeral: true });
    }

    // Check user is in same voice channel
    const voiceChannel = interaction.member?.voice?.channel;
    if (!voiceChannel || voiceChannel.id !== queue.voiceChannel.id) {
      return interaction.reply({ content: '❌ Join the same voice channel to use controls!', ephemeral: true });
    }

    await interaction.deferUpdate(); // acknowledge without sending a new message

    switch (interaction.customId) {
      case 'music_pause_resume': {
        const status = queue.player?.state?.status;
        if (status === 'paused') queue.resume();
        else queue.pause();
        break;
      }
      case 'music_skip':
        queue.skip();
        break;

      case 'music_stop':
        queue.stop();
        client.queues.delete(interaction.guildId);
        break;

      case 'music_loop':
        queue.toggleLoop();
        break;

      case 'music_vol_down': {
        const newVol = Math.max(10, Math.round(queue.volume * 100) - 10);
        queue.setVolume(newVol);
        break;
      }
      case 'music_vol_up': {
        const newVol = Math.min(100, Math.round(queue.volume * 100) + 10);
        queue.setVolume(newVol);
        break;
      }
      case 'music_queue':
        await interaction.followUp({ embeds: [queue.getQueueEmbed()], ephemeral: true });
        break;
    }
  }
});

initSpotify().then(() => client.login(process.env.DISCORD_TOKEN));

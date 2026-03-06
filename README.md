# 🎵 Discord Music Bot

A Discord music bot that plays songs from **YouTube** and **Spotify** using slash commands.

---

## ✨ Commands

| Command | Description |
|---|---|
| `/play <link or search>` | Play a YouTube/Spotify link or search by name |
| `/skip` | Skip the current song |
| `/stop` | Stop music and clear the queue |
| `/pause` | Pause playback |
| `/resume` | Resume playback |
| `/queue` | View the current queue |
| `/nowplaying` | Show what's currently playing |
| `/volume <1-100>` | Set volume |
| `/loop` | Toggle loop for the current song |
| `/shuffle` | Shuffle the queue |

---

## 🚀 Setup Guide

### 1. Prerequisites
- **Node.js v18+** → https://nodejs.org
- **FFmpeg** → https://ffmpeg.org/download.html (must be in PATH)

### 2. Create a Discord Bot
1. Go to https://discord.com/developers/applications
2. Click **New Application** → give it a name
3. Go to **Bot** tab → Click **Add Bot**
4. Copy your **Bot Token**
5. Go to **OAuth2 → General** → copy the **Client ID**
6. Under **OAuth2 → URL Generator**:
   - Scopes: `bot`, `applications.commands`
   - Bot Permissions: `Connect`, `Speak`, `Send Messages`, `Embed Links`, `Read Message History`
7. Copy the generated URL and invite the bot to your server

### 3. Get Spotify API Credentials
1. Go to https://developer.spotify.com/dashboard
2. Create a new app
3. Copy your **Client ID** and **Client Secret**

### 4. Configure Environment
```bash
cp .env.example .env
```
Edit `.env` and fill in:
```
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_client_id
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### 5. Install & Run
```bash
npm install
npm start
```

---

## 🔗 Supported Link Types
- ✅ YouTube video links
- ✅ YouTube playlist links
- ✅ Spotify track links
- ✅ Spotify playlist links
- ✅ Spotify album links
- ✅ Plain text search (searches YouTube)

---

## 📁 Project Structure
```
discord-music-bot/
├── index.js              # Bot entry point
├── package.json
├── .env.example
├── src/
│   ├── handler.js        # Command loader & slash command registration
│   ├── queue.js          # MusicQueue class & voice connection
│   ├── resolver.js       # YouTube/Spotify URL resolver
│   └── spotify.js        # Spotify auth initializer
└── commands/
    ├── play.js           # /play command
    └── _musicControls.js # All other music commands
```

---

## ⚠️ Troubleshooting
- **Bot doesn't join**: Make sure you're in a voice channel before using `/play`
- **Spotify not working**: Double-check your Spotify Client ID and Secret in `.env`
- **No audio**: Ensure FFmpeg is installed and accessible in your system PATH
- **Slash commands not showing**: Wait up to 1 hour for global commands to propagate, or test in a server where the bot has been invited

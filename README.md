# Family Display

A wall-mounted family dashboard for Raspberry Pi 4 with a 28" portrait monitor.

## Widgets
- **Clock** — current time and date
- **Weather** — Sammamish, WA (OpenWeatherMap)
- **Photo Slideshow** — rotates through local photos (synced from Google Photos)
- **Google Calendar** — today's events
- **Todoist** — today's tasks
- **Chore Chart** — 4 family members, editable from phone

## Quick Start

### 1. Clone and configure
```bash
git clone <this-repo> family-display
cd family-display
cp config.json config.json.bak
# Edit config.json with your API keys
```

### 2. Get API Keys

**OpenWeatherMap** (free):
1. Sign up at https://openweathermap.org/api
2. Copy your API key to `config.json` → `weather.apiKey`

**Todoist**:
1. Go to https://todoist.com/prefs/integrations → API token
2. Copy to `config.json` → `todoist.apiKey`

**Google Calendar**:
1. Go to https://console.cloud.google.com
2. Create a project, enable Google Calendar API
3. Create OAuth 2.0 credentials (Desktop app)
4. Download as `server/credentials.json`
5. Run the auth flow:
```bash
node server/auth-setup.js
```

### 3. Deploy to Pi
```bash
# Copy project to Pi
scp -r . pi@<PI_IP>:~/family-display

# SSH in and run setup
ssh pi@<PI_IP>
cd ~/family-display
bash scripts/setup-pi.sh
```

### 4. Sync Google Photos
```bash
# First time — authenticate
gphotos-sync --album "Family Display" ~/family-display/photos

# Cron job is set up automatically by setup script (every 6 hours)
```

### 5. Edit Chores from Phone
Open `http://<PI_IP>:3000` on your phone. The chore chart has add/remove buttons visible on mobile.

## Development (on your Mac)
```bash
npm install
cd client && npm install && cd ..
npm run dev
# Opens at http://localhost:3001
```

## Configuration

Edit `config.json`:

| Key | Description |
|-----|-------------|
| `weather.apiKey` | OpenWeatherMap API key |
| `weather.city` | City name (default: Sammamish) |
| `todoist.apiKey` | Todoist API token |
| `googleCalendar.calendarIds` | Array of calendar IDs to show |
| `photos.directory` | Path to photos folder |
| `photos.intervalSeconds` | Slideshow rotation interval |
| `chores.members` | Array of family member names |
| `display.refreshIntervalSeconds` | Widget data refresh interval |

## Architecture
```
family-display/
├── server/index.js        # Express API server
├── client/src/             # React frontend (Vite)
│   ├── App.jsx             # Dashboard layout
│   └── components/         # Clock, Weather, Photos, Calendar, Todoist, Chores
├── config.json             # All configuration
├── photos/                 # Local photo directory
├── scripts/setup-pi.sh     # Pi deployment script
└── server/data/chores.json # Chore data (auto-created)
```

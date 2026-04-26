const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.json'), 'utf8'));

const app = express();
app.use(cors());
app.use(express.json());

// Serve built client in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
}

// --- Weather API ---
app.get('/api/weather', async (req, res) => {
  try {
    const { apiKey, city, state, units } = config.weather;
    const fetch = (await import('node-fetch')).default;
    const geo = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&limit=1&appid=${apiKey}`);
    const [loc] = await geo.json();
    if (!loc) return res.json({ error: 'City not found' });
    const weather = await (await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lon}&units=${units}&appid=${apiKey}`)).json();
    const forecast = await (await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${loc.lat}&lon=${loc.lon}&units=${units}&appid=${apiKey}`)).json();
    // Hourly (next 6 x 3-hour slots for today)
    const today = new Date().toDateString();
    const hourly = (forecast.list || []).filter(f => new Date(f.dt * 1000).toDateString() === today).slice(0, 6).map(f => ({
      time: new Date(f.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric' }),
      temp: Math.round(f.main.temp), icon: f.weather[0].icon
    }));
    // Aggregate 3-hour data into daily hi/lo/icon
    const days = {};
    (forecast.list || []).forEach(f => {
      const day = new Date(f.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
      if (!days[day]) days[day] = { day, high: -Infinity, low: Infinity, icon: f.weather[0].icon, desc: f.weather[0].main };
      days[day].high = Math.max(days[day].high, f.main.temp_max);
      days[day].low = Math.min(days[day].low, f.main.temp_min);
      if (f.weather[0].icon.endsWith('d')) { days[day].icon = f.weather[0].icon; days[day].desc = f.weather[0].main; }
    });
    res.json({ current: weather, hourly, daily: Object.values(days).slice(0, 5) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- Google Calendar API ---
app.get('/api/calendar', async (req, res) => {
  try {
    const oauth = getOAuth();
    if (!oauth) return res.json({ events: [], setup: true });
    const { google } = require('googleapis');
    const calendar = google.calendar({ version: 'v3', auth: oauth });
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 3);
    endDate.setHours(23, 59, 59, 999);
    const allEvents = [];
    for (const calId of config.googleCalendar.calendarIds) {
      const resp = await calendar.events.list({
        calendarId: calId, timeMin: now.toISOString(), timeMax: endDate.toISOString(),
        singleEvents: true, orderBy: 'startTime', maxResults: 15
      });
      allEvents.push(...(resp.data.items || []));
    }
    allEvents.sort((a, b) => new Date(a.start.dateTime || a.start.date) - new Date(b.start.dateTime || b.start.date));
    res.json({ events: allEvents });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- Todoist API (Inbox sections + tasks) ---
app.get('/api/todoist', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const headers = { Authorization: `Bearer ${config.todoist.apiKey}` };
    const [secResp, taskResp] = await Promise.all([
      fetch('https://todoist.com/api/v1/sections?project_id=' + (config.todoist.inboxId || ''), { headers }),
      fetch('https://todoist.com/api/v1/tasks?project_id=' + (config.todoist.inboxId || ''), { headers })
    ]);
    const sections = (await secResp.json()).results || [];
    const tasks = (await taskResp.json()).results || [];
    const grouped = sections.map(s => ({
      id: s.id, name: s.name,
      tasks: tasks.filter(t => t.section_id === s.id)
    }));
    const unsectioned = tasks.filter(t => !t.section_id);
    res.json({ sections: grouped, unsectioned });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- Quote API ---
const funnyQuotes = [
  // Ron Swanson — Parks and Rec
  { text: "Never half-ass two things. Whole-ass one thing.", author: "Ron Swanson" },
  { text: "There's only one thing I hate more than lying: skim milk. Which is water that's lying about being milk.", author: "Ron Swanson" },
  { text: "Give a man a fish and feed him for a day. Don't teach a man to fish and feed yourself. He's a grown man. Fishing's not that hard.", author: "Ron Swanson" },
  { text: "Clear alcohols are for rich women on diets.", author: "Ron Swanson" },
  { text: "I once worked with a guy for three years and never learned his name. Best friend I ever had.", author: "Ron Swanson" },
  { text: "Crying: acceptable at funerals and the Grand Canyon.", author: "Ron Swanson" },
  { text: "Any dog under fifty pounds is a cat and cats are useless.", author: "Ron Swanson" },
  // Michael Scott — The Office
  { text: "Would I rather be feared or loved? Easy. Both. I want people to be afraid of how much they love me.", author: "Michael Scott" },
  { text: "I'm not superstitious, but I am a little stitious.", author: "Michael Scott" },
  { text: "Sometimes I'll start a sentence and I don't even know where it's going. I just hope I find it along the way.", author: "Michael Scott" },
  { text: "I knew exactly what to do. But in a much more real sense, I had no idea what to do.", author: "Michael Scott" },
  // Dwight Schrute — The Office
  { text: "Identity theft is not a joke, Jim! Millions of families suffer every year!", author: "Dwight Schrute" },
  { text: "Whenever I'm about to do something, I think, 'Would an idiot do that?' And if they would, I do not do that thing.", author: "Dwight Schrute" },
  // Phil Dunphy — Modern Family
  { text: "I'm the cool dad. That's my thang. I'm hip. I surf the web. I text. LOL: laugh out loud. OMG: oh my God. WTF: why the face.", author: "Phil Dunphy" },
  { text: "The most amazing things that can happen to a human being will happen to you if you just lower your expectations.", author: "Phil Dunphy" },
  // Jake Peralta — Brooklyn Nine-Nine
  { text: "Cool cool cool cool cool cool cool. No doubt no doubt no doubt.", author: "Jake Peralta" },
  { text: "I wasn't hurt that badly. The doctor said all my bleeding was internal. That's where the blood's supposed to be.", author: "Jake Peralta" },
  // Rosa Diaz — Brooklyn Nine-Nine
  { text: "I've only said 'I love you' to three people: my mom, my dad, and my dying goldfish. And one of those I regret.", author: "Rosa Diaz" },
  // Captain Holt — Brooklyn Nine-Nine
  { text: "Everything is garbage. Never love anything.", author: "Captain Holt" },
  // Joey Tribbiani — Friends
  { text: "Joey doesn't share food!", author: "Joey Tribbiani" },
  { text: "Over the line? You're so far past the line that you can't even see the line! The line is a dot to you!", author: "Joey Tribbiani" },
  // Chandler Bing — Friends
  { text: "I'm not great at the advice. Can I interest you in a sarcastic comment?", author: "Chandler Bing" },
  { text: "I say more dumb things before 9 AM than most people say all day.", author: "Chandler Bing" },
  // Phoebe Buffay — Friends
  { text: "I wish I could, but I don't want to.", author: "Phoebe Buffay" },
  // Leslie Knope — Parks and Rec
  { text: "We need to remember what's important in life: friends, waffles, and work. Or waffles, friends, work. Doesn't matter. But work is third.", author: "Leslie Knope" },
  { text: "I am big enough to admit that I am often inspired by myself.", author: "Leslie Knope" },
  // Andy Dwyer — Parks and Rec
  { text: "I have no idea what I'm doing, but I know I'm doing it really, really well.", author: "Andy Dwyer" },
  // Gina Linetti — Brooklyn Nine-Nine
  { text: "I'm 100% sure that I'm 0% sure of what I'm supposed to be doing.", author: "Gina Linetti" },
  // Liz Lemon — 30 Rock
  { text: "I want to go to there.", author: "Liz Lemon" },
  { text: "I believe that all anyone really wants in this life is to sit in peace and eat a sandwich.", author: "Liz Lemon" },
  // Sheldon Cooper — Big Bang Theory
  { text: "I'm not crazy. My mother had me tested.", author: "Sheldon Cooper" },
  // Tahani Al-Jamil — The Good Place
  { text: "I haven't been this upset since my good friend Taylor was rudely upstaged by my other friend Kanye.", author: "Tahani Al-Jamil" },
  // Eleanor Shellstrop — The Good Place
  { text: "I'm too young to die and too old to eat off the kids' menu. What a stupid age I am.", author: "Eleanor Shellstrop" },
  // Jason Mendoza — The Good Place
  { text: "Any time I had a problem and I threw a Molotov cocktail, boom! Right away, I had a different problem.", author: "Jason Mendoza" },
  // Bonus family-friendly zingers
  { text: "I followed my heart and it led me to the fridge.", author: "Unknown" },
  { text: "Home is where the WiFi connects automatically.", author: "Unknown" },
  { text: "Alexa, skip to Friday.", author: "Everyone" },
  { text: "Silence is golden. Unless you have kids. Then silence is suspicious.", author: "Unknown" },
  { text: "Behind every great kid is a parent who's pretty sure they're screwing it up.", author: "Unknown" },
  { text: "Having children is like living in a frat house. Nobody sleeps, everything's broken, and there's a lot of throwing up.", author: "Ray Romano" },
  { text: "Adults are just kids with money and back pain.", author: "Unknown" },
  // Nick Miller — New Girl
  { text: "I don't believe dinosaurs existed. I've seen the science. I don't believe it.", author: "Nick Miller" },
  { text: "I'm not convinced I know how to read. I've just memorized a lot of words.", author: "Nick Miller" },
  { text: "Shall I compare thee to a summer's day? No, a summer's day is not a mess.", author: "Nick Miller" },
  // Schmidt — New Girl
  { text: "Pine has no place in this loft. It's the wood of poor people and outhouses.", author: "Schmidt" },
  // Jessica Day — New Girl
  { text: "I brake for birds. I rock a lot of polka dots. I have touched glitter in the last 24 hours.", author: "Jessica Day" },
  // Barney Stinson — HIMYM
  { text: "When I get sad, I stop being sad and be awesome instead.", author: "Barney Stinson" },
  { text: "It's going to be legen — wait for it — dary. Legendary!", author: "Barney Stinson" },
  { text: "A lie is just a great story that someone ruined with the truth.", author: "Barney Stinson" },
  // Marshall Eriksen — HIMYM
  { text: "I'm cuddly, bitch. Deal with it.", author: "Marshall Eriksen" },
  // David Rose — Schitt's Creek
  { text: "I'd kill for a good coma right now.", author: "David Rose" },
  { text: "I'm incapable of faking sincerity.", author: "David Rose" },
  // Alexis Rose — Schitt's Creek
  { text: "Love that journey for me.", author: "Alexis Rose" },
  // Moira Rose — Schitt's Creek
  { text: "What you did was impulsive, capricious, and melodramatic. But it was also wrong.", author: "Moira Rose" },
  // Johnny Rose — Schitt's Creek
  { text: "You get murdered first for once.", author: "Johnny Rose" },
  // Appa — Kim's Convenience
  { text: "Why you no listen? I'm talking at you!", author: "Appa" },
  { text: "Okay, see you!", author: "Appa" },
  { text: "Sneak attack!", author: "Appa" },
  // Umma — Kim's Convenience
  { text: "That's not how you make friend. You make friend by being nice and giving them food.", author: "Umma" },
  // Janet — Kim's Convenience
  { text: "I'm Korean, I can't just be regular disappointed. I have to be dramatically disappointed.", author: "Janet Kim" }
];
app.get('/api/quote', (req, res) => {
  // Pick a new quote every 30 minutes
  const slotIndex = Math.floor(Date.now() / (30 * 60 * 1000)) % funnyQuotes.length;
  res.json(funnyQuotes[slotIndex]);
});

// --- Google OAuth helper ---
function getOAuth() {
  const tokenPath = path.resolve(config.googleCalendar.tokenPath);
  const credsPath = path.resolve(config.googleCalendar.credentialsPath);
  if (!fs.existsSync(credsPath) || !fs.existsSync(tokenPath)) return null;
  const { google } = require('googleapis');
  const creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
  const token = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
  const { client_id, client_secret, redirect_uris } = creds.installed || creds.web;
  const oauth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  oauth.setCredentials(token);
  return oauth;
}

// --- Photos API (upload + serve) ---
const multer = require('multer');
const photosDir = path.resolve(config.photos.directory);
fs.mkdirSync(photosDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, photosDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9._-]/g, ''))
  }),
  fileFilter: (req, file, cb) => cb(null, /^image\//i.test(file.mimetype))
});

app.get('/api/photos', (req, res) => {
  const files = fs.existsSync(photosDir) ? fs.readdirSync(photosDir).filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f)) : [];
  res.json({ photos: files.map(f => ({ id: f, url: `/api/photos/file/${encodeURIComponent(f)}` })), interval: config.photos.intervalSeconds });
});

app.post('/api/photos/upload', upload.array('photos', 20), (req, res) => {
  res.json({ uploaded: (req.files || []).length });
});

app.delete('/api/photos/:name', (req, res) => {
  const file = path.join(photosDir, path.basename(req.params.name));
  if (fs.existsSync(file)) fs.unlinkSync(file);
  res.json({ ok: true });
});

app.use('/api/photos/file', express.static(photosDir));

// --- Config (read-only for client) ---
app.get('/api/config', (req, res) => {
  res.json({
    photoInterval: config.photos.intervalSeconds,
    refreshInterval: config.display.refreshIntervalSeconds,
    weatherCity: `${config.weather.city}, ${config.weather.state}`,
    familyName: config.display.familyName || 'Family'
  });
});

// SPA fallback
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html')));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

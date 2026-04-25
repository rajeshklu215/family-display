// Run this once to authorize Google Calendar access
// Usage: node server/auth-setup.js

const fs = require('fs');
const path = require('path');
const http = require('http');
const { google } = require('googleapis');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.json'), 'utf8'));
const credsPath = path.resolve(config.googleCalendar.credentialsPath);
const tokenPath = path.resolve(config.googleCalendar.tokenPath);

if (!fs.existsSync(credsPath)) {
  console.error('Missing credentials.json — download from Google Cloud Console');
  process.exit(1);
}

const creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
const { client_id, client_secret } = creds.installed || creds.web;
const redirect = 'http://localhost:3100/callback';
const oauth = new google.auth.OAuth2(client_id, client_secret, redirect);

const url = oauth.generateAuthUrl({ access_type: 'offline', prompt: 'consent', scope: [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/photoslibrary.readonly'
]});
console.log('Open this URL in your browser:\n');
console.log(url);
console.log('\nWaiting for callback...');

const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith('/callback')) return;
  const code = new URL(req.url, 'http://localhost:3100').searchParams.get('code');
  const { tokens } = await oauth.getToken(code);
  fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
  res.end('Authorized! You can close this tab.');
  console.log('\nToken saved to', tokenPath);
  server.close();
  process.exit(0);
});
server.listen(3100);

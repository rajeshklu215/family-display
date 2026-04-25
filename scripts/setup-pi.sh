#!/bin/bash
# Pi setup script — run on the Raspberry Pi
set -e

echo "=== Family Display — Pi Setup ==="

# Install dependencies
sudo apt-get update
sudo apt-get install -y chromium-browser unclutter nodejs npm

# Install gphotos-sync for Google Photos
pip3 install gphotos-sync || echo "Install gphotos-sync manually: pip3 install gphotos-sync"

# Install Node dependencies
cd "$(dirname "$0")"
npm install
cd client && npm install && npx vite build && cd ..

# Create systemd service
sudo tee /etc/systemd/system/family-display.service > /dev/null <<EOF
[Unit]
Description=Family Display Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/node server/index.js
Environment=NODE_ENV=production PORT=3000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Create kiosk autostart
mkdir -p ~/.config/autostart
cat > ~/.config/autostart/family-display-kiosk.desktop <<EOF
[Desktop Entry]
Type=Application
Name=Family Display Kiosk
Exec=/bin/bash -c 'sleep 5 && unclutter -idle 0 & chromium-browser --noerrdialogs --disable-infobars --kiosk --incognito http://localhost:3000'
X-GNOME-Autostart-enabled=true
EOF

# Create gphotos-sync cron (runs every 6 hours)
PHOTOS_DIR="$(pwd)/photos"
(crontab -l 2>/dev/null; echo "0 */6 * * * gphotos-sync --album 'Family Display' $PHOTOS_DIR --use-flat-path") | sort -u | crontab -

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable family-display
sudo systemctl start family-display

echo ""
echo "=== Setup complete! ==="
echo "Dashboard: http://localhost:3000"
echo "Edit chores from phone: http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo "Next steps:"
echo "  1. Edit config.json with your API keys"
echo "  2. Set up Google Calendar OAuth (see README)"
echo "  3. Run: gphotos-sync --album 'Family Display' $PHOTOS_DIR"
echo "  4. Reboot to start kiosk mode"

#!/bin/bash
# Pi setup script — run on the Raspberry Pi
set -e

echo "=== Family Display — Pi Setup ==="

# Install dependencies
sudo apt-get update
sudo apt-get install -y chromium unclutter nodejs npm

# Install Node dependencies
cd "$(dirname "$0")"/..
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
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Create kiosk autostart
mkdir -p ~/.config/autostart
cat > ~/.config/autostart/family-display-kiosk.desktop <<EOF
[Desktop Entry]
Type=Application
Name=Family Display Kiosk
Exec=/bin/bash -c 'sleep 10 && xset s off && xset -dpms && xset s noblank && unclutter -idle 0 & chromium --noerrdialogs --disable-infobars --kiosk --incognito --disable-translate --disable-features=TranslateUI http://localhost:3000'
X-GNOME-Autostart-enabled=true
EOF

# Screen off at 11:30 PM, on at 5:30 AM
(crontab -l 2>/dev/null | grep -v 'HDMI-1'; \
 echo "30 23 * * * DISPLAY=:0 xrandr --output HDMI-1 --off"; \
 echo "30 5 * * * DISPLAY=:0 xrandr --output HDMI-1 --auto") | crontab -

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable family-display
sudo systemctl start family-display

IP=$(hostname -I | awk '{print $1}')
echo ""
echo "=== Setup complete! ==="
echo ""
echo "  Dashboard:     http://localhost:3000"
echo "  From phone:    http://$IP:3000"
echo "  Upload photos: http://$IP:3000#settings"
echo ""
echo "  Screen off 11:30 PM, on 5:30 AM"
echo "  Browser auto-refreshes daily at 3 AM"
echo ""
echo "Next steps:"
echo "  1. Edit config.json with your API keys"
echo "  2. Set up Google Calendar: node server/auth-setup.js"
echo "  3. Reboot to start kiosk mode: sudo reboot"

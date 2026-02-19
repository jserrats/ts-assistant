sudo cp miqtt.service /lib/systemd/system/miqtt.service
sudo chmod 644 /lib/systemd/system/miqtt.service
sudo systemctl daemon-reload
sudo systemctl enable miqtt.service
sudo systemctl start miqtt.service
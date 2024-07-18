#!/bin/bash

sudo python3 -m venv /opt/supervisor
sudo /opt/supervisor/bin/pip install --upgrade pip
sudo /opt/supervisor/bin/pip install supervisor
sudo ln -sf /opt/supervisor/bin/supervisord /usr/bin/supervisord
sudo ln -sf /opt/supervisor/bin/supervisorctl /usr/bin/supervisorctl
sudo cp .platform/files/supervisor/supervisord.conf /etc/supervisord.conf
sudo cp .platform/files/supervisor/supervisord.service /lib/systemd/system/supervisord.service
sudo systemctl start supervisord
sudo systemctl enable supervisord
sudo systemctl daemon-reload

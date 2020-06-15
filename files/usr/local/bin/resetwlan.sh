#/bin/bash

sudo ifdown wlan0

PW=$(pwgen -N 1 -B 8)
sudo sed -i -e 8c"wpa_passphrase=$PW" /etc/hostapd/hostapd.conf
sudo echo $PW > /var/www/html/appass.txt
sudo chown www-data:www-data /var/www/html/appass.txt

sudo cp /etc/network/interfaces.ap /etc/network/interfaces
sudo ifup wlan0
#sudo reboot
exit 0

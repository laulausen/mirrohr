#/bin/bash

#default modules
sudo cp /var/www/html/config/modules_enabled.default /var/www/html/config/modules_enabled
sudo chown -R www-data:www-data /var/www/html/config/modules_enabled
sudo rm -R /var/www/html/modules
sudo cp -R /home/pi/default/modules /var/www/html
sudo chown -R www-data:www-data /var/www/html/modules

# Deactivate ethernet if necessary
if [ $(cat /sys/class/net/eth0/operstate) = 'up' ]; then
    ifdown eth0
fi

#reset wlan
PW=$(pwgen -N 1 -B 8)
sudo sed -i -e 8c"wpa_passphrase=$PW" /etc/hostapd/hostapd.conf
sudo echo $PW > /var/www/html/appass.txt
sudo qrencode -t png -o /var/www/html/ap-qr.png 'WIFI:S:GlancrAP;T:WPA2;P:'$PW';'
sudo chown www-data:www-data /var/www/html/appass.txt /var/www/html/ap-qr.png
sudo cp /etc/network/interfaces.ap /etc/network/interfaces

#delete traces
sudo truncate --size 0 /var/www/html/wlans.txt
sudo echo -n "" >/home/pi/.bash_history
sudo echo -n "" >/var/log/auth.log
sudo rm /var/log/auth.log.*
sudo echo -n "" >/var/log/daemon.log
sudo rm /var/log/daemon.log.*
sudo echo -n "" >/var/log/debug
sudo rm /var/log/debug.*
sudo echo -n "" >/var/log/kern.log
sudo rm /var/log/kern.log.*
sudo echo -n "" >/var/log/lastlog
sudo echo -n "" >/var/log/messages
sudo rm /var/log/messages.*
sudo echo -n "" >/var/log/mysql.log
sudo rm /var/log/mysql.log.*
sudo echo -n "" >/var/log/syslog.log
sudo rm /var/log/syslog.*
sudo echo -n "" >/var/log/apache2/error.log
sudo rm /var/log/apache2/error.log.*
sudo echo -n "" >/var/log/mysql/error.log
sudo rm /var/log/mysql/error.log.*

sudo reboot

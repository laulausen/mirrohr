#!/bin/bash

cd /home/pi/
git clone https://github.com/laulausen/mirrohr.git

sudo rm -r /var/www/html
sudo cp /home/pi/mirrohr/mirrohr_html.tar /var/www/
cd /var/www/
sudo tar -xpf mirrohr_html.tar
sudo rm /var/www/mirrohr_html.tar
cd /home/pi/mirrohr/

sudo sh -c 'echo "DROP DATABASE IF EXISTS glancr;" | mysql -u root'
sudo mysql -u root < /home/pi/mirrohr/mirrohr.sql
sudo mysql_upgrade --force

sudo systemctl stop mysql.service
sudo sed -i 's/bind-address/# bind-address/g' /etc/mysql/mariadb.conf.d/50-server.cnf

sudo systemctl disable splashscreen.service
sudo rm -r /home/pi/*.sh /home/pi/disp* /home/pi/spl* /home/pi/info /home/pi/def*
sudo cp -r /home/pi/mirrohr/files/* /

sudo systemctl daemon-reload
sudo systemctl start mysql.service
sudo systemctl enable raspberrypi-net-mods.service
sudo systemctl enable raspberrypi-static-net-mods.service
sudo systemctl enable mirrohr-screen.service &&


echo "Geben Sie den GPIO-PIN (bcm) fuer den Bewegungssensor an: "
read pin_move &&
echo "Geben Sie den GPIO-PIN (bcm) fuer den Soundsensor an: "
read pin_sound &&

sudo sed -i "s|PIN = 26|PIN = $pin_move|g" /etc/default/.musterloesungen/movement_detection_with_db.py
sudo sed -i "s|PIN = 26|PIN = $pin_sound|g" /etc/default/.musterloesungen/clap_count_with_db.py


#sudo sh -c 'echo "CREATE SCHEMA DBName;" | mysql -u root' 
#sudo sh -c 'echo "CREATE USER 'benutzer'@'localhost' IDENTIFIED BY 'password';" | mysql -u root'
#sudo sh -c 'echo "GRANT ALL PRIVILEGES ON DBName.* TO 'benutzer'@'localhost';" | mysql -u root' 
#sudo sh -c 'echo "FLUSH PRIVILEGES;" | mysql -u root'
sudo sh -c 'echo "CREATE TABLE mirrohr.Flags(name VARCHAR(45) NOT NULL, wert INT NOT NULL, PRIMARY KEY (name));" | mysql -u mirrohr -pmirrohr' 
sudo sh -c 'echo "INSERT INTO mirrohr.Flags (name,wert) VALUES (\"bewegung\", 0);" | mysql -u mirrohr -pmirrohr' 
 
sudo cp /etc/default/.musterlosungen/getState.php /var/www/html/modules/info/frontend/
sudo cp /etc/default/.musterlosungen/script.js /var/www/html/modules/info/frontend/
sudo sed -i "s|exit 0||g" /etc/rc.local
sudo sh -c 'echo "/usr/bin/python /etc/default/.musterloesungen/clap_count_with_db.py &" >> /etc/rc.local'
sudo sh -c 'echo "/usr/bin/python /etc/default/.musterloesungen/movement_detection_with_db.py &" >> /etc/rc.local'
sudo sh -c 'echo "exit 0" >> /etc/rc.local'

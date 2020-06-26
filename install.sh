#!/bin/bash

wget https://github.com/downloads/laulausen/mirrohr/musterloesungen.tar
tar -xf musterloesungen.tar  
sudo sh -c 'echo "CREATE SCHEMA DBName;" | mysql -u root' 
sudo sh -c 'echo "CREATE USER 'benutzer'@'localhost' IDENTIFIED BY 'password';" | mysql -u root'
sudo sh -c 'echo "GRANT ALL PRIVILEGES ON DBName.* TO 'benutzer'@'localhost';" | mysql -u root' 
sudo sh -c 'echo "FLUSH PRIVILEGES;" | mysql -u root'
sudo sh -c 'echo "CREATE TABLE DBName.Flags(name VARCHAR(45) NOT NULL, wert INT NOT NULL, PRIMARY KEY (name));" | mysql -u root DBName' 
sudo sh -c 'echo "INSERT INTO DBName.Flags (name,wert) VALUES (\"bewegung\", 0);" | mysql -u root DBName' 
 
sudo cp /home/pi/.musterlosungen/getState.php /var/www/html/modules/info/frontend/
sudo cp /home/pi/.musterlosungen/script.js /var/www/html/modules/info/frontend/
sudo sed -i "s|exit 0|/usr/bin/python /home/pi/.musterloesungen/clap_count_with_db.py &|g" /etc/rc.local
sudo sh -c 'echo "/usr/bin/python /home/pi/.musterloesungen/movement_detection_with_db.py &" >> /etc/rc.local'
sudo sh -c 'echo "exit 0" >> /etc/rc.local'

#/bin/bash
WLANSTATUS=$(cat /sys/class/net/wlan0/operstate)
ETHSTATUS=$(cat /sys/class/net/eth0/operstate)
sudo pkill wpa_supplicant
if [ -z $1 ]; then
	if [ $WLANSTATUS = "up" ]; then ifdown wlan0; fi
	sudo cp /etc/network/interfaces.lan /etc/network/interfaces
	interface="eth0"
else
	if [ $ETHSTATUS = "up" ]; then ifdown eth0; fi
	if [ $WLANSTATUS = "up" ]; then ifdown wlan0; fi
	sudo cp /etc/network/interfaces.wlan /etc/network/interfaces
	sudo sed -i -e 16c"wpa-ssid \"$1\"" /etc/network/interfaces
	sudo sed -i -e 17c"wpa-psk \"$2\"" /etc/network/interfaces
	interface="wlan0"
fi

sudo ifup $interface

_IP=$(ip -f inet -o addr show $interface|cut -d\  -f 7 | cut -d/ -f 1) || true

if [ "$_IP" ]; then
	echo 1
else
	echo 0
        sudo ifdown wlan0
	sudo cp /etc/network/interfaces.ap /etc/network/interfaces
	sudo ifup wlan0
fi

exit 0


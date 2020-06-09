#!/bin/bash
WLANSTATUS=$(cat /sys/class/net/wlan0/operstate)

if [[ $WLANSTATUS == "down" ]]; then
  sudo cp /etc/network/scan-wlan /etc/network/interfaces.d/
  ifup wlan0 > /dev/null
fi

sudo iwlist wlan0 scan | grep ESSID | cut -d "\"" -f 2 > /var/www/html/wlans.txt
cat /var/www/html/wlans.txt

# WLAN was down before the scan, so shut it down again
if [[ $WLANSTATUS == "down" ]]; then
  ifdown wlan0 > /dev/null
  sudo rm /etc/network/interfaces.d/scan-wlan
fi

exit 0

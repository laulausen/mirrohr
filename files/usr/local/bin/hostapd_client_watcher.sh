#!/bin/bash

if [[ $2 == "AP-STA-CONNECTED" ]]; then
	sleep 8 # make sure arp is ready
	CLIENT=$(arp -a | grep "$3")
	if [[ ! $CLIENT == "" ]]; then
		echo $CLIENT  >> /var/www/html/tmp/ap-clients.log 2>&1
	else
		echo "UNKNOWN_DEVICE UNKNOWN_IP" >> /var/www/html/tmp/ap-clients.log 2>&1
	fi
	exit 0
fi


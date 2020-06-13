#!/bin/sh
xsetroot -solid black
xset -dpms # disable DPMS (Energy Star) features.
xset s off # disable screen saver
xset s noblank # don't blank the video device
# unclutter -idle 0.01 -root &
xrandr --output HDMI-1 --rotate right
matchbox-window-manager -use_titlebar no -use_cursor no &
sudo -u pi -H chromium-browser \
	--display=:0.0 \
	--noerrdialogs \
	--disable-translate \
	--app-auto-launched \
	--incognito \
	--app=http://localhost/$1
#	--kiosk http://localhost/$1


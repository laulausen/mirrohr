#!/bin/sh
xsetroot -solid black 2>&1
xset -dpms 2>&1 # disable DPMS (Energy Star) features.
xset s off 2>&1 # disable screen saver
xset s noblank 2>&1 # don't blank the video device
# unclutter -idle 0.01 -root &
#xrandr --output HDMI-1 --rotate right
matchbox-window-manager -use_titlebar no -use_cursor no 2>&1&
while true; do
        sudo -u pi -H chromium-browser \
                --display=:0.0 \
                --noerrdialogs \
                --disable-translate \
                --app-auto-launched \
                --incognito \
                --disable-crash-report \
                --disable-info-bars \
                --app=http://localhost/$1 2>&1
done


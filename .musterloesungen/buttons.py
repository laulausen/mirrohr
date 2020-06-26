#!/usr/bin/python

# Pakete importieren
import RPi.GPIO as GPIO
import time
import os

# variablen definieren
PIN_REBOOT   = 14
PIN_SHUTDOWN = 15

# GPIO definieren
GPIO.setmode(GPIO.BCM)
GPIO.setup(PIN_REBOOT,GPIO.IN)
GPIO.setup(PIN_SHUTDOWN,GPIO.IN)

# Callback-Funktion
def interrupt(channel):
	command="echo 'GPIO: " + str(channel) + "'"
	if (channel==PIN_REBOOT):
		command="sudo reboot"
	elif (channel==PIN_SHUTDOWN):
		command="sudo shutdown now"
	os.system(command)

# Interrupt-Event hinzufuegen, steigende Flanke
GPIO.add_event_detect(PIN_REBOOT, GPIO.RISING, callback = interrupt, bouncetime = 100)
GPIO.add_event_detect(PIN_SHUTDOWN, GPIO.RISING, callback = interrupt, bouncetime = 100)

# abfrageschleife
try:
	while True:
		time.sleep(1)

except KeyboardInterrupt:
	print("\nExit")
	GPIO.cleanup()

#!/bin/python

# Import der Python libraries
import RPi.GPIO as GPIO
import time

# GPIO definieren
PIN = 26

# GPIO als "Input" festlegen
GPIO.setmode(GPIO.BCM)
GPIO.setup(PIN,GPIO.IN)

maxPause	=	300	# max Zeit in msec zwischen Klatschen
soundDauer      =	50 	# max Dauer eines Klatschgeraeusches
letzte_1    	=  	0	# Zeitpunkt der letzten 1 am Sensor

# gibt Anzahl der seit 1.1.1979 vergangenen Millisekunden als int zurueck
def jetzt():
	return int(round(time.time() * 1000))

print("gestartet")

#################################################################################
#                                                                               #
#     WENN MAN DAS PROBLEM AUSREICHEND ANALYSIERT, REDUZIERT ES SICH AUF DAS	#
#	  		 " FINDEN DER RICHTIGEN 1 "				#
#										#
#	^	    soundDauer                                                  #
#	|	<------------------>                                            #
#	|				   maxPause				#
#	|		       <------------------------------>			#
#	|                                                                       #
#	|	    clap 1				  clap 2		#
#	|	 _   _   _   _			      _   _   _   _		#
#     1-|	|#| |#| |#| |#|			     |#| |#| |#| |#|		#
#	|	|#| |#| |#| |#|                      |#| |#| |#| |#|            #
#	|	|#| |#| |#| |#|                      |#| |#| |#| |#|            #
#	|	|#| |#| |#| |#|                      |#| |#| |#| |#|            #
#     0_|_______|#|_|#|_|#|_|#|______________________|#|_|#|_|#|_|#|________>	#
#		 ^   ^	 ^   ^			      ^	  ^   ^   ^	    t	#
#		 |   |	 |   |			      |	          		#
#	    letzte_1 |   |   |			   JACKPOT     		        #
#		     |   |   |							#
#		 letzte_1|   |                                                  #
#			 |   |                                                  #
#		    letzte_1 |                                                  #
#			     |                                                  #
#			 letzte_1                                               #
#										#
#  IN DIESEM FALL DIEJENIGE 1, DEREN VORGAENGER LAENGER ALS EINE SOUNDDAUER,	#
# 	     ABER KUERZER ALS DIE MAXIMALE PAUSE ZURUECK LIEGT			#
#										#
#################################################################################

try:

	while True:
		if GPIO.input(PIN):
			if (soundDauer < (jetzt() - letzte_1) < maxPause):
				print("doppelt geklatscht")
			letzte_1 = jetzt()
		time.sleep(0.001)

except KeyboardInterrupt:
	GPIO.cleanup()
	print("Exit")

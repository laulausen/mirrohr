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
claps		=	0	# Zaehler
erste_1		= 	0	# Zeitpunkt Geraeuschanfang
letzte_1    	=  	0	# Zeitpunkt der letzten 1 am Sensor
jetzt		=	0	# Hifsvariable, um Zeit zu sparen

print("gestartet")
letzte_1 = int(round(time.time() * 1000))	# muss so initialisiert werden, da sonst beim ersten Durchlauf staendig "0 mal geklatscht" ausgegeben werden wuerde

#################################################################################################################################################################################
#																						#
#	^	    soundDauer                                                                                                                                                  #
#	|	<------------------>                                                                                                                                            #
#	|				   maxPause								maxPause							#
#	|		       <------------------------------>			       		    <------------------------------>						#
#	|                                                                                                                                                  			#
#	|	    clap 1				  clap 2			  clap 3						     clap 1			#
#	|	 _   _   _   _			      _   _   _   _		      _   _   _   _						 _   _   _   _			#
#     1-|	|#| |#| |#| |#|			     |#| |#| |#| |#|		     |#| |#| |#| |#|						|#| |#| |#| |#|			#
#	|	|#| |#| |#| |#|                      |#| |#| |#| |#|                 |#| |#| |#| |#|						|#| |#| |#| |#|			#
#	|	|#| |#| |#| |#|                      |#| |#| |#| |#|                 |#| |#| |#| |#|						|#| |#| |#| |#|			#
#	|	|#| |#| |#| |#|                      |#| |#| |#| |#|                 |#| |#| |#| |#|						|#| |#| |#| |#|			#
#     0_|_______|#|_|#|_|#|_|#|______________________|#|_|#|_|#|_|#|_________________|#|_|#|_|#|_|#|____________________________________________|#|_|#|_|#|_|#|__________>	#
#		 ^   ^	 ^   ^			      ^	  ^   ^   ^		      ^	  ^   ^   ^		 		     ^		 ^   ^   ^   ^		  t	#
#		 |   |	 |   |			      |	          |		      |	          |				     |		 |           |			#
#	     erste_1 |   |   |			   erste_1     letzte_1	           erste_1     letzte_1		(jetzt - letzte_1) > maxPause    |       letzte_1		#
#		     |   |   |														      erste_1				#
#		 letzte_1|   |                                                                                                                                                  #
#			 |   |                                                                                                                                                  #
#		    letzte_1 |                                                                                                                                                  #
#			     |                                                                                                                                                  #
#			 letzte_1                                                                                                                                               #
#                                                                                                                                                  				#
#################################################################################################################################################################################

while True:

	# zeitpunkt in variable speichern, um nicht 7 mal time.time() aufrufen zu muessen => algorythmus ist so etwas schneller :-)
	jetzt = int(round(time.time() * 1000))

	if GPIO.input(PIN):	# wir haben eine 1 am sensor

		if (maxPause < (jetzt - letzte_1)):
			# FALL 1: letzte 1 am sensor ist laenger als die maxPause her
			#	---> also beginnt DAS ERSTE geraeusch

			claps = 1				# koennte erster clap sein (wir wissen ja noch nicht, wie lang das geraeusch sein wird)
			erste_1 = jetzt				# geraeuschanfang merken

		elif (((letzte_1 - erste_1) < soundDauer) & (soundDauer < (jetzt - letzte_1) < maxPause)):
			# FALL 2: letzte 1 am sensor liegt innerhalb der maxPause
			#	UND das letzte geraeusch hatte die laenge eines klatschens
			# 	UND die jetzige 1 am Sensor gehoert nicht mehr dazu (es war eine kurze Pause)
			#	---> also beginnt EIN WEITERES geraeusch

			claps = claps + 1			# da es sich nicht um das erste klatschen handeln kann, zaehlen wir eins hoch
			erste_1 = jetzt				# und merken uns wiederum den anfang

		letzte_1 = jetzt				# diese 1 am sensor als die momentan letzte merken

	else:			# wir haben eine 0 am sensor

		if (((letzte_1 - erste_1) < soundDauer) & (maxPause < (jetzt - letzte_1))):
			# die laenge des letzten geraeusches entspricht einer klatschdauer
			#	UND es ist bis jetzt schon mehr zeit vergangen,
			#	als die maximale pausenlaenge --> also wurde eine klatschsequenz beendet

			print(str(claps) + " mal geklatscht")	# ausgabe
			letzte_1 = jetzt			# und initialen wert vergeben
	time.sleep(0.001)


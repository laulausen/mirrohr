#!/bin/python

# Import der Python libraries
import RPi.GPIO as GPIO
import time
import mysql.connector

# GPIO definieren
PIN = 26

# GPIO als "Input" festlegen
GPIO.setmode(GPIO.BCM)
GPIO.setup(PIN,GPIO.IN)

maxPause	=	400	# max Zeit in msec zwischen Klatschen
soundDauer      =	80 	# max Dauer eines Klatschgeraeusches
claps		=	0	# Zaehler
erste_1		= 	0	# Zeitpunkt Geraeuschanfang
letzte_1    	=  	0	# Zeitpunkt der letzten 1 am Sensor
jetzt		=	0	# Hifsvariable, um Zeit zu sparen


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

# Ausgabe auf allen Consolen
def printToAllConsoles(text):
	# zuerst Standardausgabe
	print( text )
	# dann Testen, wieviele Pseudoterminals existieren
	for i in range(0,len( os.listdir( "/dev/pts/" )) - 1): if (os.path.exists( "/dev/pts/" + str(i))):
		# und zum Schluss auf jedem Pseudoterminal ausgeben
		os.system( "echo '" + text + "' > " + "/dev/pts/" + str(i)

def schaltberechtigungSetzen():
    # aktuellen wert lesen
    try:
        cnx = mysql.connector.connect(user='mirrohr', password='mirrohr', host='localhost', database='mirrohr')
        cursor = cnx.cursor(buffered=True)
        statement="select wert from Flags where name like 'bewegung';"
        cursor.execute(statement)
        rows = cursor.fetchall()
        for row in rows:
             result = int(row[0])
	# wert umdrehen und setzen
	if (result == 0):
		result = 1
	else:
		result = 0
	statement="update Flags set wert=" + str(result) + " where name like 'bewegung';"
        cursor.execute(statement)
        cnx.commit()
        cursor.close()
        cnx.close()
    except:
        print("Fehler in leseStatus:")

printToAllConsoles("clap detection: started")
letzte_1 = int(round(time.time() * 1000))	# muss so initialisiert werden, da sonst beim ersten Durchlauf staendig "0 mal geklatscht" ausgegeben werden wuerde

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

			printToAllConsoles("clap detection: clapped " + str(claps) + " times")	# ausgabe

			if (claps == 2):
				schaltberechtigungSetzen()

			letzte_1 = jetzt			# und initialen wert vergeben
	time.sleep(0.001)


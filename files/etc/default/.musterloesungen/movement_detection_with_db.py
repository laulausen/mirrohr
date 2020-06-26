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

Pause		= 10000 # Zeit in msek die ohne Bewegung vergehen muss, bis sich das display ausshaltet 
letzte_bewegung = 0 	# Zeitpunkt der letzten Bewegung
display		= 1

# gibt Anzahl der seit 1.1.1979 vergangenen Millisekunden als int zurueck
def jetzt():
        return int(round(time.time() * 1000))

def darfSchalten():
    result=0
    try:
    	cnx = mysql.connector.connect(user='mirrohr', password='mirrohr', host='localhost', database='mirrohr')
    	cursor = cnx.cursor(buffered=True)
    	statement="select wert from Flags where name like 'bewegung';"
        cursor.execute(statement)
        rows = cursor.fetchall()
        for row in rows:
             result = int(row[0])
        cnx.commit()
        cursor.close()
        cnx.close()
    except:
	print("Fehler in leseStatus:")
    return result


print("movement detection: started")

try:
        while True:
		# es gibt eine bewegung
                if GPIO.input(PIN):
			# falls das display noch aus und das schalten erlaubt ist
			if (display == 0 and darfSchalten() == 1):
				print("movement detection: display on")	# einschalten
				display = 1		# merken, dass das display jetzt an ist

			letzte_bewegung = jetzt()	# den zeitpunkt der aktuellen bewegung merken

		# es gibt keine bewegung und das display ist an
		elif (display == 1):
			# wenn die zeitspanne seit der letzten bewegung die laenge der vorgegebenen pause erreicht hat und das schalten erlaubt ist
			if (((jetzt() - letzte_bewegung) > Pause) and darfSchalten() == 1):
				print("movement detection: display off")	# ausschalten
				display = 0		# merken, dass das display jetzt aus ist
		time.sleep(0.5)

except KeyboardInterrupt:
        GPIO.cleanup()
        print("Exit")

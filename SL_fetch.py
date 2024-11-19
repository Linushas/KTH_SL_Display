import requests
import json
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

url = "https://transport.integration.sl.se/v1/sites/"
site1 = "7000" # Huddinge Sjukhus (Visar data för busshållplatserna: Huddinge Sjukhus -A, -B, -C, -E, -F, -G)
#site2 = "7001" # Flemingsbergs centrum
#site3 = "7002" # Diagnosvägen
#site4 = "7003" # Ortopedvägen
#site5 = "7004" # Södertörns högskola
#site6 = "7005" # Hälsovägen
#site7 = "7006" # Flemingsbergs station
#site8 = "7007" # Flemingsbergs stn (Fjärrtåg)
#site9 = "7008" # Blickagången
fullUrl = url + site1 + "/departures"

@app.route('/getBusData', methods=['GET'])
def getBusData():
    response = requests.get(fullUrl)
    eventData = response.json()
    busList = [
        {"destination": eventData["departures"][i]["destination"], 
         "display": eventData["departures"][i]["display"], 
         "line": eventData["departures"][i]["line"]["designation"],
         "message": ', '.join([deviation["message"] for deviation in eventData["departures"][i]["deviations"]]) 
                   if "deviations" in eventData["departures"][i] and eventData["departures"][i]["deviations"] 
                   else 'null'
        }
        for i in range(0,len(eventData["departures"]))
    ]
    return jsonify(busList)

if __name__ == '__main__':
    app.run(debug=True)
    

# ---------------------------------------
# TODO: Add info messages about traffic. Ex) If eventData["departures"][i]["deviations"]["message"] != null -- buslist{"message": ... }
#  - In script.js switch between message and time-display
'''
"deviations": [
                {
                    "importance_level": 7,
                    "consequence": "INFORMATION",
                    "message": "Förseningar upp till 10 minuter pga bilköer"
                }
            ]
'''
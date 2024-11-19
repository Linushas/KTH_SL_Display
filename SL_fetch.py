import requests
import json
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

url = "https://transport.integration.sl.se/v1/sites/"
site1 = "7000" # Huddinge Sjukhus (Visar data för busshållplatserna: Huddinge Sjukhus -A, -B, -C, -D, -E, -F, -G)
#site2 = "7001" # Flemingsbergs centrum
#site3 = "7002" # Diagnosvägen
#site4 = "7003" # Ortopedvägen
#site5 = "7004" # Södertörns högskola
#site6 = "7005" # Hälsovägen
#site7 = "7006" # Flemingsbergs station
#site8 = "7007" # Flemingsbergs stn (Fjärrtåg)
#site9 = "7008" # Blickagången
site_trains = "9524" # Pendeltåg
busURL = url + site1 + "/departures"
trainURL = url + site_trains + "/departures"

@app.route('/getBusData', methods=['GET'])
def getBusData():
    response = requests.get(busURL)
    eventData = response.json()
    busList = [
        {"destination": eventData["departures"][i]["destination"], 
         "display": eventData["departures"][i]["display"], 
         "line": eventData["departures"][i]["line"]["designation"],
         "message": ', '.join([deviation["message"] for deviation in eventData["departures"][i]["deviations"]]) 
                   if "deviations" in eventData["departures"][i] and eventData["departures"][i]["deviations"] 
                   else 'null',
         "stop": eventData["departures"][i]["stop_point"]["designation"]
        }
        for i in range(0,len(eventData["departures"]))
    ]
    return jsonify(busList)

@app.route('/getTrainData', methods=['GET'])
def getTrainData():
    response = requests.get(trainURL)
    eventData = response.json()
    trainList = [
        {
            "destination": departure["destination"], 
            "display": departure["display"], 
            "line": departure["line"]["designation"],
            "message": ', '.join([deviation["message"] for deviation in departure["deviations"]]) 
                       if "deviations" in departure and departure["deviations"] 
                       else 'null',
            "stop": departure["stop_point"]["designation"]
        }
        for departure in eventData["departures"] 
        if departure["line"]["transport_mode"] == "TRAIN"
    ]
    return jsonify(trainList)


if __name__ == '__main__':
    app.run(debug=True)
    
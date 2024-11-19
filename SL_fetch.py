import requests
import json
from flask import Flask, jsonify
from flask_cors import CORS
from url import busURL, trainURL, metroURL, tramURL, shipURL

app = Flask(__name__)
CORS(app)

def appendDeparture(response, type):
    data = response.json()
    list = [
        {
            "destination": departure["destination"], 
            "display": departure["display"], 
            "line": departure["line"]["designation"],
            "message": ', '.join([deviation["message"] for deviation in departure["deviations"]]) 
                       if "deviations" in departure and departure["deviations"] 
                       else 'null',
            "stop": departure["stop_point"].get("designation", departure["stop_point"].get("name", "Unknown"))
                    if "stop_point" in departure and departure["stop_point"]
                    else 'null',

        }
        for departure in data["departures"] 
        if departure["line"]["transport_mode"] == type
    ]
    return jsonify(list)

@app.route('/getBusData', methods=['GET'])
def getBusData():
    response = requests.get(busURL)
    return appendDeparture(response, "BUS")

@app.route('/getTrainData', methods=['GET'])
def getTrainData():
    response = requests.get(trainURL)
    return appendDeparture(response, "TRAIN")

@app.route('/getMetroData', methods=['GET'])
def getMetroData():
    response = requests.get(metroURL)
    return appendDeparture(response, "METRO")

@app.route('/getShipData', methods=['GET'])
def getShipData():
    response = requests.get(shipURL)
    return appendDeparture(response, "SHIP")

@app.route('/getTramData', methods=['GET'])
def getTramData():
    response = requests.get(tramURL)
    return appendDeparture(response, "TRAM")


if __name__ == '__main__':
    app.run(debug=True)
    
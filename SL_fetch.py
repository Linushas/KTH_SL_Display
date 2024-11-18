import requests
import json
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # För att möjliggöra anrop från olika origin

url = "https://transport.integration.sl.se/v1/sites/"
site = "7000" # Huddinge Sjukhus
fullUrl = url + site + "/departures"

response = requests.get(fullUrl)
eventData = response.json()

@app.route('/getBusData', methods=['GET'])
def getBusData():
    response = requests.get(fullUrl)
    eventData = response.json()
    busList = [
        {"destination": item["destination"], 
         "display": item["display"], 
         "line": item["line"]["designation"]}
        for item in eventData["departures"]
    ]
    return jsonify(busList)

if __name__ == '__main__':
    app.run(debug=True)
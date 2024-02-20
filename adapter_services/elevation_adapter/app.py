import os

from flask import Flask
from flask import request
from flask_cors import CORS
import requests

app = Flask(__name__)
tour_port = os.environ.get("TOUR_SERVICE_PORT")
tour_host_port= os.environ.get("TOUR_SERVICE_HOST_PORT")
CORS(app, resources={
    r"/*": {
        "origins": [
            f"http://localhost:{tour_host_port}",
            f"http://tour_service:{tour_port}"
        ]
    }
})

@app.route("/", methods=["GET"])
def check():
    response = {
        "status": "success",
        "message": "Service is running",
        "data": None
    }
    return response, 200


@app.route("/elevation", methods=["GET"])
def elevation():
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if lat is None:
        response = {
            "status": "fail",
            "data": {
                "lat": "A latitude is required"
            }
        }
        return response, 400

    try:
        lat = float(lat)
        if lat < -90 or lat > 90:
            response = {
                "status": "fail",
                "data": {
                    "lat": "Latitude must be a value between -90 and 90"
                }
            }
            return response, 400
    except ValueError:
        response = {
            "status": "fail",
            "data": {
                "lat": "Latitude is not a float number"
            }
        }
        return response, 400

    if lon is None:
        response = {
            "status": "fail",
            "data": {
                "lon": "A longitude is required"
            }
        }
        return response, 400

    try:
        lon = float(lon)
        if lon < -180 or lon > 180:
            response = {
                "status": "fail",
                "data": {
                    "lon": "Longitude must be a value between -180 and 180"
                }
            }
            return response, 400
    except ValueError:
        response = {
            "status": "fail",
            "data": {
                "lon": "Longitude is not a float number"
            }
        }
        return response, 400

    api_key = os.environ.get("GOOGLE_ELEVATION_API_KEY")
    api_url = f"https://maps.googleapis.com/maps/api/elevation/json?locations={lat},{lon}&key={api_key}"

    try:
        result = requests.get(api_url)
        status = result.status_code
        result = result.json()
    except requests.exceptions.RequestException:
        response = {
            "status": "error",
            "error": "Error while calling Google Elevation API"
        }
        return response, 500

    if result == {} or result == [] or result is None:
        response = {
            "status": "fail",
            "data": {
                "elevation": "It was not possible to find the elevation for the given place"
            }
        }
        return response, 400

    if result["status"] != "OK":
        response = {
            "status": "error",
            "error": "Something went wrong with Elevation API"
        }
        return response, 400

    if status == 200:
        response = {
            "status": "success",
            "message": "Elevation found successfully",
            "data": {
                "elevation": {
                    "meters": result["results"][0]["elevation"],
                    "lat": result["results"][0]["location"]["lat"],
                    "lon": result["results"][0]["location"]["lng"]
                }
            }
        }
        return response, 200
    else:
        response = {
            "status": "error",
            "error": "Error while calling Overpass API"
        }
        return response, status

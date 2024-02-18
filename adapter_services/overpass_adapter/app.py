from flask import Flask
from flask import request
import requests

app = Flask(__name__)


@app.route("/", methods=["GET"])
def check():
    response = {
        "status": "success",
        "message": "Service is running",
        "data": None
    }
    return response, 200


# Find peaks
@app.route("/overpass/peaks", methods=["GET"])
def peaks():
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    search_range = request.args.get("range")

    if search_range is None:
        response = {
            "status": "fail",
            "data": {
                "range": "A range is required"
            }
        }
        return response, 400

    try:
        search_range = float(search_range)
        if search_range < 0:
            response = {
                "status": "fail",
                "data": {
                    "range": "Range must be a positive decimal number"
                }
            }
            return response, 400
    except ValueError:
        response = {
            "status": "fail",
            "data": {
                "range": "Range is not a float number"
            }
        }
        return response, 400

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

    headers = {'Content-Type': 'application/x-www-form-urlencoded'}

    query = (f'[out:json];'
             f'node["natural"="peak"]'
             f'(around:{search_range},{lat},{lon});'
             f'out;')

    api_url = "https://overpass-api.de/api/interpreter"

    try:
        result = requests.get(api_url, data=query, headers=headers)
        status = result.status_code
        result = result.json()
    except requests.exceptions.RequestException:
        response = {
            "status": "error",
            "error": "Error while calling Overpass API"
        }
        return response, 500

    if result == {} or result == [] or result is None:
        response = {
            "status": "fail",
            "data": {
                "peaks": "It was not possible to find peaks around the specified area"
            }
        }
        return response, 400

    if not result["elements"]:
        response = {
            "status": "fail",
            "data": {
                "peaks": "It was not possible to find peaks around the specified area"
            }
        }
        return response, 400

    peaks_list = []
    for data in result["elements"]:
        peak = {
            "lat": data["lat"],
            "lon": data["lon"],
            "name": data["tags"]["name"]
        }

        if "ele" not in data["tags"]:
            peak["elevation"] = None
        else:
            peak["elevation"] = data["tags"]["ele"]

        peaks_list.append(peak)

    if status == 200:
        response = {
            "status": "success",
            "message": "Peaks found successfully",
            "data": {
                "peaks": peaks_list
            }
        }
        return response, 200
    else:
        response = {
            "status": "error",
            "error": "Error while calling Overpass API"
        }
        return response, status


# Find alpine huts and shelters
@app.route("/overpass/huts", methods=["GET"])
def huts():
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    search_range = request.args.get("range")

    if search_range is None:
        response = {
            "status": "fail",
            "data": {
                "range": "A range is required"
            }
        }
        return response, 400

    try:
        search_range = float(search_range)
        if search_range < 0:
            response = {
                "status": "fail",
                "data": {
                    "range": "Range must be a positive decimal number"
                }
            }
            return response, 400
    except ValueError:
        response = {
            "status": "fail",
            "data": {
                "range": "Range is not a float number"
            }
        }
        return response, 400

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
        if lat < -180 or lat > 180:
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

    headers = {'Content-Type': 'application/x-www-form-urlencoded'}

    query = (f'[out:json];('
             f'node["tourism"="alpine_hut"]'
             f'(around:{search_range},{lat},{lon});'
             f'node["tourism"="wilderness_hut"]'
             f'(around:{search_range},{lat},{lon});'
             f'node["shelter_type"="basic_hut"]'
             f'(around:{search_range},{lat},{lon});'
             f');out;')

    api_url = "https://overpass-api.de/api/interpreter"

    try:
        result = requests.get(api_url, data=query, headers=headers)
        status = result.status_code
        result = result.json()
    except requests.exceptions.RequestException:
        response = {
            "status": "error",
            "error": "Error while calling Overpass API"
        }
        return response, 500

    if result == {} or result == [] or result is None:
        response = {
            "status": "fail",
            "data": {
                "huts": "It was not possible to find huts around the specified area"
            }
        }
        return response, 400

    if not result["elements"]:
        response = {
            "status": "fail",
            "data": {
                "huts": "It was not possible to find huts around the specified area"
            }
        }
        return response, 400

    huts_list = []
    for data in result["elements"]:
        hut = {
            "lat": data["lat"],
            "lon": data["lon"],
            "name": data["tags"]["name"],
        }
        if "ele" not in data["tags"]:
            hut["elevation"] = None
        else:
            hut["elevation"] = data["tags"]["ele"]

        huts_list.append(hut)

    if status == 200:
        response = {
            "status": "success",
            "message": "Huts found successfully",
            "data": {
                "huts": huts_list
            }
        }
        return response, 200
    else:
        response = {
            "status": "error",
            "error": "Error while calling Overpass API"
        }
        return response, status

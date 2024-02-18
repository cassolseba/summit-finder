from flask import Flask
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


@app.route("/nominatim/<string:place>", methods=["GET"])
def nominatim(place):
    if place is None:
        response = {
            "status": "fail",
            "data": {
                "place": "A place to geocode is required"
            }
        }
        return response, 400

    response_format = "json"
    api_url = f"https://nominatim.openstreetmap.org/search?q={place}&format={response_format}"

    try:
        result = requests.get(api_url)
        status = result.status_code
        result = result.json()
    except requests.exceptions.RequestException:
        response = {
            "status": "error",
            "error": "Error while calling Nominatim"
        }
        return response, 500

    if result == {} or result == [] or result is None:
        response = {
            "status": "fail",
            "data": {
                "place": "It was not possible to geocode the place"
            }
        }
        return response, 400

    result = result[0]

    if status == 200:
        place_filtered = {
            "lat": result["lat"],
            "lon": result["lon"],
            "name": result["name"],
            "fullname": result["display_name"]
        }

        response = {
            "status": "success",
            "message": "Place geocoded successfully",
            "data": {
                "place": place_filtered
            }
        }
        return response, 200
    else:
        response = {
            "status": "error",
            "error": "Error while calling Nominatim"
        }
        return response, status

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

    query = f"q={place}"
    format = "format=json"

    api_url = f"https://nominatim.openstreetmap.org/search?{query}&{format}"

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
        response = {
            "status": "success",
            "message": "Place geocoded successfully",
            "data": {
                "place": result
            }
        }
        return response, 200
    else:
        response = {
            "status": "error",
            "error": "Error while calling Nominatim"
        }
        return response, status

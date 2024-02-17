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

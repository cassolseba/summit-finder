FROM python:3.12-alpine
WORKDIR /elevation_adapter
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0", "--port=5000"]
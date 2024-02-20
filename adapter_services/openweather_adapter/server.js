/* ---------- DOTENV ---------- */
const dotenv = require("dotenv");
dotenv.config();

/* ---------- EXPRESS ---------- */
const express = require("express");
const server = express();
server.use(express.json());

/* ---------- CORS ---------- */
const cors = require("cors");

const corsOptions = {
    origin: [
        `http://localhost:${process.env.FORECAST_SERVICE_HOST_PORT}`,
        `http://forecast_service:${process.env.FORECAST_SERVICE_PORT}`
    ]

};
server.use(cors(corsOptions));

/* ---------- SET ROUTES ---------- */
const routes = require("./routes/weather.routes");
server.use('/', routes);

server.get('/', (req, res) => {
    res.status(200).send("Welcome to the openweather adapter!");
})

/* ---------- RUN SERVER ---------- */
const port = process.env.OPENWEATHER_ADAPTER_PORT || 8080;
server.listen(port, () => {
    console.log(`SERVER IS FIRE ON PORT http://localhost:${port}`);
})
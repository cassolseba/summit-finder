<script>
import axios from "axios";
const SEARCH_URL = "http://tour_service:8090/";

export default {
  name: "SearchView",
  methods: {
    async search(research) {
      await axios
          .get(SEARCH_URL, {
            params: {
              origin: research.origin,
              destination: research.destination,
              range: research.range
            }
          }).then((response) => {
            console.log("Search successful");
            window.alert("Search successful");
            this.tour = response.data.data;
            if (response.data.data.peaks[0]) {
              this.peakfinder = `https://www.peakfinder.com/embed/?lat${response.data.data.peaks[0].lat}&lng=${response.data.data.peaks[0].lon}`
            }
          }).catch((error) => {
            console.log(`Error in search ${error}`);
            window.alert("Search error");
          })
    }
  },
  data() {
    return {
      research: {
        origin: null,
        destroy: null,
        range: null
      },
      tour: null,
      peakfinder: null
    }
  },
}
</script>

<template>
  <v-card
      v-if="!tour"
      class="ma-auto pa-5"
      elevation="8"
      width="500"
      rounded="lg"
  >
    <v-text-field
        v-model="research.origin"
        density="compact"
        placeholder="Origin"
        variant="outlined"
    ></v-text-field>

    <v-text-field
        v-model="research.destination"
        density="compact"
        placeholder="Destination"
        variant="outlined"
    ></v-text-field>

    <v-text-field
        v-model="research.range"
        density="compact"
        placeholder="Range (0 - 20km)"
        variant="outlined"
    ></v-text-field>

    <v-btn
        block
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        @click="search(research)"
    >Search</v-btn>
  </v-card>

  <v-card
      v-else
      class="my-5 mx-auto pa-5"
      elevation="8"
      width="500"
      rounded="lg"
  >
    Origin: {{ tour.origin.name }}
    <v-divider/>
    <br>
    Destination: {{ tour.destination.name }}
    <v-divider/>
    <br>
    <b>Peaks</b>
    <br>
    <span
        v-for="peak in tour.peaks"
        :key="peak"
    >
      Peak: {{ peak.name }}
      <br>
      Elevation: {{ peak.elevation }} m
      <br>
      <br>
    </span>
    <v-divider/>
    <br>
    <b>Alpine huts</b>
    <br>
    <span
      v-for="hut in tour.huts"
      :key="hut"
    >
      Hut: {{ hut.name }}
      <br>
      Elevation: {{ hut.elevation }} m
      <br>
      <br>
    </span>
    <v-divider/>
    <br>
    <b>Current weather at {{ tour.destination.name }}</b>
    <br>
    Condition: {{ tour.weather.condition }}
    <br>
    Description: {{ tour.weather.description }}
    <br>
    Temperature: {{ tour.weather.temp }} °C
    <br>
    Perceived temperature: {{ tour.weather.perceivedTemp }} °C
    <br>
    Visibility: {{ tour.weather.visibility }} m
    <br>
    Wind: {{ tour.weather.wind }} km/h
    <br>
    Cloudiness: {{ tour.weather.clouds }} %
    <br>
    Sunrise: {{ tour.weather.sunrise }}
    <br>
    Sunset: {{ tour.weather.sunset }}
    <br>
    <br>
    <v-divider/>
    <br>
    <b>Tomorrow forecast</b>
    <br>
    Date: {{ tour.tomorrow.date }}
    <br>
    Condition:
    <span
      v-for="condition in tour.tomorrow.condition"
      :key="condition"
    >
      {{ condition }} |
    </span>
    <br>
    Description:
    <span
        v-for="description in tour.tomorrow.description"
        :key="description"
    >
      {{ description }} |
    </span>
    <br>
    Temperature: max {{ tour.tomorrow.maxTemp }} °C, min {{ tour.tomorrow.minTemp }}, average {{ tour.tomorrow.avgTemp }}
    <br>
    Rain: {{ tour.tomorrow.totalRain }} mm
    <br>
    Snow: {{ tour.tomorrow.totalSnow }} mm
    <br>
    Precipitation probability: {{ (tour.tomorrow.maxProbability) * 100 }} %
    <br>
    Humidity: max {{ tour.tomorrow.maxHumidity }} %, min {{ tour.tomorrow.minHumidity }}
    <br>
    Visibility: max {{ tour.tomorrow.maxVisibility }} m, min {{ tour.tomorrow.minVisibility }} m, average {{ tour.tomorrow.avgVisibility }} m
    <br>
    Wind: max {{ tour.tomorrow.maxWind }} km/h, min {{ tour.tomorrow.minWind }} km/h, average {{ tour.tomorrow.avgWind}} km/h
    <br>
    <v-divider/>
    <v-btn
        block
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        @click="search(research)"
    >Save</v-btn>

  </v-card>

  <v-card
      v-if="peakfinder"
      class="my-5 mx-auto pa-5"
      elevation="8"
      width="500"
      rounded="lg"
  >
    <iframe
        :src="peakfinder"
        width="100%"
        height="570"
        name="peakfinder">
        <p>Your Browser do not support iFrames.</p>
    </iframe>
  </v-card>


</template>
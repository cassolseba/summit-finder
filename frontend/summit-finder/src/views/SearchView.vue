<script>
import axios from "axios";
import authHeader from "../../services/data.service";
const SEARCH_URL = `http://tour_service:${process.env.VUE_APP_TOUR_PORT || 8090}/tour`;
console.log(SEARCH_URL);
const SAVE_URL = `http://management_service:${process.env.VUE_APP_MANAGEMENT_PORT || 8088}/wish`;

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
            if (this.tour.peaks[0]) {
              console.log("COORDINATESSSSSSS: " + this.tour.peaks[0].lat + " " + this.tour.peaks[0].lon)
              this.peakFinder = `https://www.peakfinder.com/embed/?lat=${this.tour.peaks[0].lat}&lng=${this.tour.peaks[0].lon}`
            }
            if(this.tour.origin && this.tour.destination) {
              this.googleMaps = `https://www.google.com/maps/embed/v1/directions?key=${this.key}&origin=${response.data.data.origin.lat},${response.data.data.origin.lon}&destination=${response.data.data.destination.lat},${response.data.data.destination.lon}`;
            }
            for (let peak of this.tour.peaks ) {
              this.peaksNames.push(peak.name);
              console.log(peak.name);
            }
            for (let hut of this.tour.huts ) {
              this.hutsNames.push(hut.name);
            }
            this.loading = false;
          }).catch((error) => {
            console.log(`Error in search ${error}`);
            window.alert("Search error");
          })

    },
    async save(tour) {
      await axios
          .post(SAVE_URL, {
            originLat: tour.origin.lat,
            originLon: tour.origin.lon,
            originName: tour.origin.name,
            destinationLat: tour.destination.lat,
            destinationLon: tour.destination.lon,
            destinationName: tour.destination.name,
            huts: this.selectedHuts,
            peaks: this.selectedPeaks
          }, { "headers": authHeader() }).then(() => {
            console.log("Wish saved successful");
            window.alert("Wish saved successful");
          }).catch((error) => {
            console.log(`Error while saving the wish ${error}`);
            window.alert("Save error");
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
      selectedPeaks: [],
      peaksNames: [],
      selectedHuts: [],
      hutsNames: [],
      peakFinder: null,
      googleMaps: null,
      key: process.env.VUE_APP_GOOGLE_MAPS_KEY,
      loggedIn: localStorage.getItem('user'),
      username: localStorage.getItem('username'),
      loading: true,
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
        placeholder="Range (0 - 20.000m)"
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
    <br>
    <v-divider/>
    <br>
    <div v-if="loggedIn">
    <b>Save peaks and huts in your wishlist</b>
    <v-autocomplete
        class="my-2"
        chips
        closable-chips
        multiple
        label="Peaks"
        :items="peaksNames"
        v-model="selectedPeaks"
        :disabled="loading || peaksNames.length === 0"
    ></v-autocomplete>

    <v-autocomplete
        class="my-2"
        chips
        closable-chips
        multiple
        label="Huts"
        :items="hutsNames"
        v-model="selectedHuts"
        :disabled="loading || hutsNames.length === 0"
    ></v-autocomplete>

    <v-btn
        block
        class="my-2"
        color="blue"
        size="large"
        variant="tonal"
        @click="save(tour)"
    >Save</v-btn>
    </div>
  </v-card>

  <v-card
      v-if="peakFinder"
      class="my-5 mx-auto pa-5"
      elevation="8"
      width="500"
      rounded="lg"
  >
    <iframe
        :src="peakFinder"
        width="100%"
        height="570"
        name="peakFinder">
    </iframe>
  </v-card>

  <v-card
      v-if="googleMaps"
      class="my-5 mx-auto pa-5"
      elevation="8"
      width="500"
      rounded="lg"
  >
    <iframe
        :src="googleMaps"
        width="100%"
        height="450"
        name="googlemaps"
        allowfullscreen>
    </iframe>
  </v-card>
</template>
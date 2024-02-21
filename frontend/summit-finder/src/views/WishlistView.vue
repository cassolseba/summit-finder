<script>
import axios from "axios";
import authHeader from "../../services/data.service";

const WISHLIST_URL = `http://localhost:${process.env.VUE_APP_MANAGEMENT_PORT}/wishlist`;
const WISH_URL = `http://localhost:${process.env.VUE_APP_MANAGEMENT_PORT}/wish`;
export default {
  name: "WishlistView",
  data() {
    return {
      wishlist: [],
      boardIsVisible: false,
      loggedIn: localStorage.getItem('user'),
      username: localStorage.getItem('username')
    }
  },
  methods: {
    async findWishlist() {
      await axios
          .get(WISHLIST_URL, { headers: authHeader() })
          .then((response) => {
            console.log("Wishlist retrieved successfully");
            this.wishlist = response.data.data.wishlist;
          }).catch((error) => {
            this.wishlist = [];
            console.log(`Error while retrieving the wishlist: ${error}`);
          });
    },
    async deleteWish(_id) {
      await axios
          .delete(`${WISH_URL}/${_id}`, { headers: authHeader(),})
          .then(() => {
              console.log("Wish deleted successfully");
              window.alert("Wish deleted successfully");
              this.$router.push({ name: 'Search'});
          }).catch((error) => {
            console.log(`Error while deleting the wish: ${error}`);
          })
    },
    async getAllWishlists() {
      await axios
          .get(`${WISHLIST_URL}/all`, { headers: authHeader(),})
          .then((response) => {
            console.log("All wishlists retrieved successfully");
            window.alert("All wishlists retrieved successfully");
            this.wishlist = response.data.data.wishlists;
          }).catch((error) => {
            console.log(`Error while retrieving all wishlists: ${error}`);
          })
    },
    async deleteAllWishlists() {
      await axios
          .delete(`${WISHLIST_URL}/all`, { headers: authHeader(),})
          .then(() => {
            console.log("All wishlists deleted successfully");
            window.alert("All wishlists deleted successfully");
            this.$router.push({ name: 'Search'});
          }).catch((error) => {
            console.log(`Error while deleting all wishlists: ${error}`);
          })
    },
    async deleteWishlist() {
      await axios
          .delete(WISHLIST_URL, { headers: authHeader(),})
          .then(() => {
            console.log("Wishlists deleted successfully");
            window.alert("Wishlists deleted successfully");
            this.$router.push({ name: 'Search'});
          }).catch((error) => {
            console.log(`Error while deleting the wishlists: ${error}`);
          })
    },
    toggleBoard() {
      this.boardIsVisible = !this.boardIsVisible;
    }
  },
  mounted() {
    this.findWishlist();
  }
}
</script>

<template>
  <div class="w-100 text-center" v-if="wishlist.length > -1 && loggedIn" @click="toggleBoard">
    <v-icon
        v-if="!boardIsVisible"
        icon="mdi-chevron-down"
        size="large"
    ></v-icon>
    <v-icon
        v-if="boardIsVisible"
        icon="mdi-chevron-up"
        size="large"
    ></v-icon>

    <v-expand-transition>
      <v-card
          v-if="boardIsVisible"
          class="ma-auto pa-5"
          elevation="8"
          width="500"
          rounded="lg"
      >
        <b>{{ username }} board</b>
        <v-btn
            block
            class="my-5"
            color="red"
            size="large"
            variant="tonal"
            @click="deleteWishlist"
        >Delete wishlist</v-btn>
        <br>
        <v-divider color="grey"/>
        <br>
        <b>Admin Board</b>
        <v-btn
            block
            class="my-5"
            color="red"
            size="large"
            variant="tonal"
            @click="getAllWishlists"
        >Get wishlists</v-btn>
        <v-btn
            block
            class="my-5"
            color="red"
            size="large"
            variant="tonal"
            @click="deleteAllWishlists"
        >Delete wishlists</v-btn>
      </v-card>
    </v-expand-transition>
  </div>

  <div
      v-if="wishlist.length === 0 && loggedIn"
      class="text-center my-10"
  >
    <h2>No wishes yet. Search for peaks and huts!</h2>
  </div>

  <div
      v-if="!loggedIn"
      class="text-center my-10"
  >
    <h2>You have to sign in to see your wishlist!</h2>
  </div>

  <v-card
      v-show="wishlist && loggedIn"
      v-for="wish in wishlist" :key="wish"
      class="ma-auto py-1 px-5"
      elevation="8"
      width="500"
      rounded="lg"
  >
    <div
      class="text-center my-2"
    >
      <b>From {{ wish.originName }} to {{ wish.destinationName }}</b>
    </div>
    <div class="text-center"><v-icon icon="mdi-image-filter-hdr"></v-icon></div>
    <div
        class="text-center"
        v-for="peak in wish.peaks"
        :key="peak"
    >
      {{ peak }} <br>
    </div>
    <br>
    <div class="text-center"><v-icon icon="mdi-home-map-marker"></v-icon></div>
    <div
        class="text-center"
        v-for="hut in wish.huts"
        :key="hut"
    >
      {{ hut }} <br>
    </div>
    <br>
    <v-btn
        block
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        @click="deleteWish(wish._id)"
    >Delete</v-btn>
  </v-card>
</template>

<style scoped>

</style>
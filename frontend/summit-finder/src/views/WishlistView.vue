<script>
import axios from "axios";
import authHeader from "../../services/data.service";

const WISHLIST_URL = `http://management_service:${process.env.VUE_APP_MANAGEMENT_PORT || 8088}/wishlist`;
const WISH_URL = `http://management_service:${process.env.VUE_APP_MANAGEMENT_PORT || 8088}/wish`;
export default {
  name: "WishlistView",
  data() {
    return {
    wishlist: []
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
            this.wishlist = null;
            console.log(`Error while retrieving the wishlist: ${error}`);
          });
    },
    async deleteWish(_id) {
      await axios
          .delete(`${WISH_URL}/${_id}`, { headers: authHeader(),})
          .then(() => {
              console.log("Wish deleted successfully");
              window.alert("Wish deleted successfully");
              this.$router.go({ path:'/wishlist'});
          }).catch((error) => {
            console.log(`Error while deleting the wish: ${error}`);
          })
    }
  },
  mounted() {
    this.findWishlist();
  }
}
</script>

<template>

  <v-card
      v-show="wishlist"
      v-for="wish in wishlist" :key="wish"
      class="ma-auto pa-5"
      elevation="8"
      width="500"
      rounded="lg"
  >
    <br>
    From {{ wish.originName }} to {{ wish.destinationName }}
    <br>
    Saved peaks: {{ wish.peaks }}
    <br>
    Saved huts: {{ wish.huts }}
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
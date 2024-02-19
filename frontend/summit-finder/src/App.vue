<template>
  <v-app>
    <v-toolbar color="primary">
      <v-toolbar-title>
        <v-icon
            size="large"
            icon="mdi-summit"
            class="mr-1"
        ></v-icon>
        {{ appTitle }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-tabs
          color="darken-1"
          bg-color="primary"
          align-tabs="center"
      >
        <router-link to="/">
          <v-tab>
            <v-icon
                size="large"
                icon="mdi-home"
                class="mr-1"
            ></v-icon>
            Home
          </v-tab>
        </router-link>

        <router-link to="/search">
          <v-tab>
            <v-icon
                size="large"
                icon="mdi-magnify"
                class="mr-1"
            ></v-icon>
            Search
          </v-tab>
        </router-link>

        <router-link to="/wishlist">
          <v-tab>
            <v-icon
                size="large"
                icon="mdi-list-box"
                class="mr-1"
            ></v-icon>
            Wishlist
          </v-tab>
        </router-link>

        <v-spacer></v-spacer>

        <router-link to="/login">
          <v-tab>
            <v-icon
                icon="mdi-login"
                size="large"
            ></v-icon>
          </v-tab>
        </router-link>
      </v-tabs>
    </v-toolbar>

    <router-view/>

  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      appTitle: 'Summit Finder',
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

a {
  text-decoration: none;
  color: white;
  font-weight: 800;
}
</style>

<script>
export default {
  name: "LoginView",
  data() {
    return {
      signin: {
        username: "",
        password: "",
      },
      signup: {
        username: "",
        name: "",
        lastName: "",
        email: "",
        password: "",
      },
      visible: false,
      registration: false,
      loggedIn: localStorage.getItem('user'),
      username: localStorage.getItem('username')
    }
  },
  methods: {
    login() {
      this.loading = true;

      this.$store.dispatch("auth/login", this.signin)
          .then(() => {
            this.$router.push( {path: '/' } );
          }).catch(() => {
            this.loading = false;
          })
    },
    register() {
      this.loading = true;

      this.$store.dispatch("auth/register", this.signup)
          .then(() => {
            this.$router.push( {path: '/' } );
          }).catch(() => {
            this.loading = false;
          })
    },
    logout() {
      this.$store.dispatch('auth/logout');
      this.loggedIn = false
      this.$router.go( { path: '/'} );
    },
    toggleRegistration() {
      this.registration = !this.registration;
    }
  }
}
</script>

<template>
  <v-card
      v-if="!loggedIn"
      class="ma-auto pa-5"
      elevation="8"
      width="500"
      rounded="lg"
  >
    <div v-if="!registration">
      <v-text-field
          v-model="signin.username"
          density="compact"
          placeholder="Username"
          prepend-inner-icon="mdi-account-outline"
          variant="outlined"
      ></v-text-field>

      <v-text-field
          v-model="signin.password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
      ></v-text-field>

      <v-btn
          block
          class="mb-8"
          color="blue"
          size="large"
          variant="tonal"
          @click="login"
      >Sign In</v-btn>

      <span
          class="cursor-pointer text-grey"
          @click="toggleRegistration"
      >I don't have an account</span>
    </div>

    <div v-else>
      <v-text-field
          v-model="signup.username"
          density="compact"
          placeholder="Username"
          prepend-inner-icon="mdi-account-outline"
          variant="outlined"
      ></v-text-field>

      <v-text-field
          v-model="signup.name"
          density="compact"
          placeholder="Name"
          variant="outlined"
      ></v-text-field>

      <v-text-field
          v-model="signup.lastName"
          density="compact"
          placeholder="Last name"
          variant="outlined"
      ></v-text-field>

      <v-text-field
          v-model="signup.email"
          density="compact"
          placeholder="Email"
          variant="outlined"
      ></v-text-field>

      <v-text-field
          v-model="signup.password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
      ></v-text-field>

      <v-btn
          block
          class="mb-8"
          color="blue"
          size="large"
          variant="tonal"
          @click="register"
      >Sign Up</v-btn>

      <span
          class="cursor-pointer text-grey"
          @click="toggleRegistration"
      >I have an account</span>
    </div>
  </v-card>

  <v-card
      v-else
      class="ma-auto pa-5"
      elevation="8"
      width="500"
      rounded="lg"
  >
    <span class="ma-5">You are signed in as <b>{{ username }}</b></span>
    <v-btn
        block
        class="my-2"
        color="blue"
        size="large"
        variant="tonal"
        @click="logout"
    >Logout</v-btn>
  </v-card>

</template>

<style scoped>

</style>
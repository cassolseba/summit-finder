import { createApp } from 'vue'
import App from './App.vue'
import vuetify from 'vuetify'
import 'Vuetify/dist/vuetify.min.css'

const app = createApp(App);
app
    .use(vuetify)
    .mount('#app');

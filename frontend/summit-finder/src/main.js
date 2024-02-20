import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"
import store from './store';

// Vuetify
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { md1 } from 'vuetify/blueprints';
import '@mdi/font/css/materialdesignicons.css';

const vuetify = createVuetify({
    theme: {
        defaultTheme: 'light'
    },
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
    components,
    directives,
    blueprint: md1,
})

const app = createApp(App);
app
    .use(store)
    .use(vuetify)
    .use(router)
    .mount('#app');

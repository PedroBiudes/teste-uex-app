import { createApp } from 'vue';
import App from './App.vue';
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css';

import CoreuiVue from '@coreui/vue'
import '@coreui/coreui/dist/css/coreui.min.css'

import CoreUIIcons from '@coreui/icons-vue'
import VueGoogleMaps from '@fawmi/vue-google-maps';

import VueTheMask from 'vue-the-mask';

const app = createApp(App)

app.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyC0ajpw8lBrfQ5_tN-xiEs8a7PNTCpJMB8',
    libraries: 'places'
  }
});
app.use(VueTheMask);
app.use(CoreuiVue)
app.use(CoreUIIcons)
app.use(router)

app.mount('#app')

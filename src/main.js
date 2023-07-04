import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'
import Heart from 'vue-material-design-icons/Heart.vue'
import './assets/main.css'
import inputUi from './components/InputUI.vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
    .use(router)
    .component('inputUi', inputUi)
    .component('Heart', Heart)
    .mount('#app')

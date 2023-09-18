import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'
import Heart from 'vue-material-design-icons/Heart.vue'
import './assets/main.css'
import components from '@/components/UI'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
components.forEach( component=>{
    app.component(component.name,component)
})

app.use(pinia)
    .use(router)
    .component('Heart', Heart)
    .mount('#app')

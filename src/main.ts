import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import '@coreui/coreui/dist/css/coreui.min.css'
import '@coreui/icons/css/free.min.css'
import 'bulma/css/bulma.css'

import { db, auth } from './firebase.ts'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.config.globalProperties.$db = db
app.config.globalProperties.$auth = auth

app.mount('#app')

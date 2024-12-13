import { createApp } from 'vue'
import App from './App.vue'

import "bulma/css/bulma.css"

import { db, auth } from "./firebase.js"; // importer le fichier firebase

const app = createApp(App)
import router from './router';

app.config.globalProperties.$db = db;
app.config.globalProperties.$auth = auth;
app.use(router);
app.mount('#app');
const socket = new WebSocket("ws://localhost:8080/ws");

// Écoute des événements WebSocket
socket.onopen = () => {
    console.log("WebSocket connection established.");
};

socket.onmessage = (event) => {
    console.log("Message from server:", event.data);
};

socket.onerror = (error) => {
    console.error("WebSocket encountered an error:", error);
};



// Ajouter le socket dans les propriétés globales de Vue
app.config.globalProperties.$socket = socket;





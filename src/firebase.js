// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVDvx3Ee4YXINQC0a-XwsUmLpIt7Wmcxo",
  authDomain: "my-project-4f301.firebaseapp.com",
  projectId: "my-project-4f301",
  storageBucket: "my-project-4f301.firebasestorage.app",
  messagingSenderId: "288677139782",
  appId: "1:288677139782:web:3bf6eff5824718aca0c147",
  measurementId: "G-JBJYWTHF0C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
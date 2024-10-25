// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJCPwI5xA6up_HY4LIPD0dwpSlTvVw5ho",
  authDomain: "test-firebase-a9275.firebaseapp.com",
  projectId: "test-firebase-a9275",
  storageBucket: "test-firebase-a9275.appspot.com",
  messagingSenderId: "158066819946",
  appId: "1:158066819946:web:72694356a5881057289b13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
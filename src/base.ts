// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDp8JRnVyeFon1scIHo2IvA-9NU5A9IhiY",
  authDomain: "respend-ss.firebaseapp.com",
  projectId: "respend-ss",
  storageBucket: "respend-ss.firebasestorage.app",
  messagingSenderId: "921978394713",
  appId: "1:921978394713:web:e9dd0d6e8b4a7276033948"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
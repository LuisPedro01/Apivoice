// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'




// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrz0y_LGBWVCoglP8U6-D-ZL9zIuv5zC0",
  authDomain: "apivoice-4e079.firebaseapp.com",
  projectId: "apivoice-4e079",
  storageBucket: "apivoice-4e079.appspot.com",
  messagingSenderId: "380957200486",
  appId: "1:380957200486:web:ca4540c9b3e4272a181da7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { Firestore, getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { getStorage, ref } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrz0y_LGBWVCoglP8U6-D-ZL9zIuv5zC0",
  authDomain: "apivoice-4e079.firebaseapp.com",
  projectId: "apivoice-4e079",
  storageBucket: "apivoice-4e079.appspot.com",
  messagingSenderId: "380957200486",
  appId: "1:380957200486:web:ca4540c9b3e4272a181da7",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export { firebase };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initializa authentication
export const auth = getAuth(app);

// Initializa Database
export const db = firebase.firestore();
db.settings({
  experimentalAutoDetectLongPolling: true,
  timestampsInSnapshot: true,
  merge: true,
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});


// Initialize storage
export const storage = getStorage(app);

export const createUserDocument = async (user, additionalData) => {
  if (!user) return;

  const userRef = firebase.firestore.doc(`Nomes/${user.uid}`);

  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { email } = user;
    const { nome } = additionalData;

    try {
      userRef.set({
        displayName,
        email,
        createdAt: new Date(),
      });
    } catch (error) {
      console.log("Erro ao criar um novo user", error);
    }
  }
};

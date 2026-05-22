import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBunId8XMoozrVuvyJRUvLZibdTuit2MTY",
  authDomain: "sciat-peakstate.firebaseapp.com",
  projectId: "sciat-peakstate",
  storageBucket: "sciat-peakstate.firebasestorage.app",
  messagingSenderId: "782465749969",
  appId: "1:782465749969:web:325a154413016bf17006f0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);

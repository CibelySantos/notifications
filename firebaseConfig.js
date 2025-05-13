// Cibely Cristiny dos Santos

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVBwB2T63KsTfxMPfAVXQgnqMqlmk5UjM",
  authDomain: "auth-firebase-projeto-au-d81b4.firebaseapp.com",
  projectId: "auth-firebase-projeto-au-d81b4",
  storageBucket: "auth-firebase-projeto-au-d81b4.firebasestorage.app",
  messagingSenderId: "641013292961",
  appId: "1:641013292961:web:b9a16ab14956c3769c35e0",
  measurementId: "G-KLXSMJ803Q"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {db, collection, getDocs};

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';
import { initializeApp } from "firebase/app";
import 'firebase/compat/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnKTLztKesd3IbOXZT5yY8RytS6YcdQ60",
  authDomain: "practica10a-4a996.firebaseapp.com",
  projectId: "practica10a-4a996",
  storageBucket: "practica10a-4a996.appspot.com",
  messagingSenderId: "927038451991",
  appId: "1:927038451991:web:0f2ffd44dd9f9d6df68752"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);


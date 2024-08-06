// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXqUR5DvjpzuCkTGhd66lI_nsEYqrdjak",
  authDomain: "pantryapp-a8f18.firebaseapp.com",
  projectId: "pantryapp-a8f18", 
  storageBucket: "pantryapp-a8f18.appspot.com",
  messagingSenderId: "272739644528",
  appId: "1:272739644528:web:dc2d2cd76c51e99eef70b5",
  measurementId: "G-9EX4X67J46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export {
    app, firestore
}
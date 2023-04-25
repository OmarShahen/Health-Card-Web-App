// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzA-DGG4V4EOTqlQlCVFpV3YoDmAPZLls",
  authDomain: "barbels-f6774.firebaseapp.com",
  projectId: "barbels-f6774",
  storageBucket: "barbels-f6774.appspot.com",
  messagingSenderId: "88162271951",
  appId: "1:88162271951:web:0c45a331e3e1f866a52dba",
  measurementId: "G-52N7Z1ZPYX"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
export const storage = getStorage(app)
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-48b0a.firebaseapp.com",
  projectId: "mern-auth-48b0a",
  storageBucket: "mern-auth-48b0a.appspot.com",
  messagingSenderId: "597010866766",
  appId: "1:597010866766:web:3d3a5955bf2b623b8e191f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
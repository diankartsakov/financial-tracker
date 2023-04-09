import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAXhJHIgKOiv-yG7nhkjZHR7TjaTfna1fg",
  authDomain: "firabase-demo-99588.firebaseapp.com",
  projectId: "firabase-demo-99588",
  storageBucket: "firabase-demo-99588.appspot.com",
  messagingSenderId: "932966757594",
  appId: "1:932966757594:web:1a0a5eedb58e466cd161e3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
    app,
    auth,
}
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7H9l9K6249_tPII7Kx27t5zsgmJWCxos",
  authDomain: "python-user-login.firebaseapp.com",
  projectId: "python-user-login",
  storageBucket: "python-user-login.firebasestorage.app",
  messagingSenderId: "53562209973",
  appId: "1:53562209973:web:f78af8e5eefc0872a5f0fc",
  measurementId: "G-K1DJJMRSVT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

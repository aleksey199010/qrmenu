import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDVoVCe0d1r8Fr7V8tUkD8kufHd1m06cRo",
  authDomain: "qrmenu-uz.firebaseapp.com",
  projectId: "qrmenu-uz",
  storageBucket: "qrmenu-uz.firebasestorage.app",
  messagingSenderId: "682968885178",
  appId: "1:682968885178:web:e036ceffc2c45b7593df83"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
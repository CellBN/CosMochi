// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Firebase Config
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyBmThyVoLbzL9pWUbCH-rWgA6-4r8uHKk4",
  authDomain: "cosmochi-order.firebaseapp.com",
  projectId: "cosmochi-order",
  storageBucket: "cosmochi-order.firebasestorage.app",
  messagingSenderId: "248296954133",
  appId: "1:248296954133:web:bc16674919bdf64fe4f11c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Export ke global
window.db = db;
window.ref = ref;
window.push = push;
window.onValue = onValue;
window.remove = remove;

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAx43gwVEyVEyHGspd2Qw7ZOH5Xfbt0K_8",
  authDomain: "recipeapp-f7dfe.firebaseapp.com",
  projectId: "recipeapp-f7dfe",
  storageBucket: "recipeapp-f7dfe.firebasestorage.app",
  messagingSenderId: "1043059039355",
  appId: "1:1043059039355:web:d75e4467cc29d54315d6de",
  databaseURL: "https://recipeapp-f7dfe-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

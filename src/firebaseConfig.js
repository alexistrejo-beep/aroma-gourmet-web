// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Importamos Firestore

const firebaseConfig = {
  apiKey: "AIzaSyB2M3NPvexLGHcxDCyrYb1MjNituKsWYEU",
  authDomain: "practicamitienda.firebaseapp.com",
  projectId: "practicamitienda",
  storageBucket: "practicamitienda.firebasestorage.app",
  messagingSenderId: "402884450222",
  appId: "1:402884450222:web:194923c5bfee8fb18c9a3f",
  measurementId: "G-6LW8EMXCDH"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Exportamos la base de datos para usarla en App.jsx
export const db = getFirestore(app);
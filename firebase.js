// js/firebase.js

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp
} from
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "YOUR_EXISTING_API_KEY",
    authDomain: "tailmatess.firebaseapp.com",
    projectId: "tailmatess",
    storageBucket: "tailmatess.firebasestorage.app",
    messagingSenderId: "445299543083",
    appId: "1:445299543083:web:e7be85a3eae32f8ba5ee6e",
    measurementId: "G-ZLQG062LVE"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export {
    app,
    auth,
    db,
    onAuthStateChanged,
    signOut,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp
};

// firebase.js

import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {
    getDatabase,
    ref,
    push,
    set,
    update,
    remove,
    onValue,
    child
} 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// Your Firebase Configuration
const firebaseConfig = {

    apiKey: "AIzaSyBn7r8KojAGt1KfHuPJWFWpltG9uSBgLEU",

    authDomain: "tindahan-price-finder.firebaseapp.com",

    databaseURL: "https://tindahan-price-finder-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId: "tindahan-price-finder",

    storageBucket: "tindahan-price-finder.firebasestorage.app",

    messagingSenderId: "350986009133",

    appId: "1:350986009133:web:5dc548f0154b70d03696a4",

    measurementId: "G-ZGZ370NW0M"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);


// Initialize Realtime Database

const db = getDatabase(app);


// Items location in database

const itemsRef = ref(db, "items");


// Export for script.js

export {
    itemsRef,
    push,
    set,
    update,
    remove,
    onValue,
    child
};
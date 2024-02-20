import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyB6zznaf9_BvNcpEEd6Qs_IHQ8RAPKTkQg",
    authDomain: "proiect-tic-96c8f.firebaseapp.com",
    projectId: "proiect-tic-96c8f",
    storageBucket: "proiect-tic-96c8f.appspot.com",
    messagingSenderId: "265787003711",
    appId: "1:265787003711:web:3ed87164a5e289fedcb98a"
};

// Initialize Firebase
initializeApp(firebaseConfig)

// Initializez Firebase auth
const auth = getAuth()

// Initializez Firestore
const db = getFirestore();

export { auth, db }
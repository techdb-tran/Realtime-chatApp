import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import {connectFirestoreEmulator, getFirestore} from 'firebase/firestore'
const firebaseConfig = {
    apiKey: "AIzaSyDaxd8r3PkpaF_tAFcGOVx2dRSPCP7G_zo",
    authDomain: "chat-app-828f8.firebaseapp.com",
    projectId: "chat-app-828f8",
    storageBucket: "chat-app-828f8.appspot.com",
    messagingSenderId: "967966669498",
    appId: "1:967966669498:web:59a61da2e3edb35325e083",
    measurementId: "G-2JKT19TKMS"
  };

const app = initializeApp(firebaseConfig);
// firebase.initializeApp(firebaseConfig);
// const auth = firebase.auth();
const db = getFirestore(app);
const auth = getAuth(app);
if(window.location.hostname==="localhost"){
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
}
export {auth, db };

export default app;
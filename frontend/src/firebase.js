import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDrDLrnLE0q1cTUEzzZ-1HL1gqDpwn2HHM",
  authDomain: "smart-food-wastage-e3475.firebaseapp.com",
  projectId: "smart-food-wastage-e3475",
  storageBucket: "smart-food-wastage-e3475.firebasestorage.app",
  messagingSenderId: "501915025688",
  appId: "1:501915025688:web:18ebb1a377d74792149e6d"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDOVgviIMDMWfZTHx3OqrCWwNwi9Y-9cdQ",
  authDomain: "form-data-caf04.firebaseapp.com",
  projectId: "form-data-caf04",
  storageBucket: "form-data-caf04.appspot.com",
  messagingSenderId: "643794993651",
  appId: "1:643794993651:web:277a9472a870b8fbe11286",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { db };

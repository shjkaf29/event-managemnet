import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA93vSfRZ-mmZ53OMTgnL9Z3qA7hXWy8ig",
  authDomain: "eventmanagement-55048.firebaseapp.com",
  projectId: "eventmanagement-55048",
  storageBucket: "eventmanagement-55048.appspot.com",
  messagingSenderId: "798377782332",
  appId: "1:798377782332:web:00017c2506c1d513b52739",
  measurementId: "G-ZFW6N0KYYY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Set persistence without using setPersistence directly
auth.setPersistence(browserLocalPersistence);

export { auth, db, storage };
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDmGWXiz8Mrjbsr5gzdTWgcfaQ8eY_hv5E",

  authDomain: "prabal-ps-st.firebaseapp.com",

  projectId: "prabal-ps-st",

  storageBucket: "prabal-ps-st.firebasestorage.app",

  messagingSenderId: "314470142879",

  appId: "1:314470142879:web:c019a2b1c9caa7765ea3aa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, storage, db };

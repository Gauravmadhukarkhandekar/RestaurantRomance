import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCla6DRvS9g-2VUIHfuwxVY1Hdl4kElcvQ",
  authDomain: "beatsofwashington-a760b.firebaseapp.com",
  projectId: "beatsofwashington-a760b",
  storageBucket: "beatsofwashington-a760b.firebasestorage.app",
  messagingSenderId: "713875891450",
  appId: "1:713875891450:web:5824d3ede6599a69b6d543",
  measurementId: "G-3PJX86XHRE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

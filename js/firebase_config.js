import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCwRy2DiUyOrUgMOl5BC4F15HruzBT42P8",
  authDomain: "demo1-3de1d.firebaseapp.com",
  projectId: "demo1-3de1d",
  storageBucket: "demo1-3de1d.appspot.com",
  messagingSenderId: "473128339086",
  appId: "1:473128339086:web:165f7e4c64f2f31f672bdf",
  measurementId: "G-60XJ9Y0M3N"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
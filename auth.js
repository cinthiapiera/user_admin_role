import { auth, db } from "./firebase_config.js";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { 
    doc, 
    setDoc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Selección de elementos
const registerContainer = document.getElementById("registerContainer");
const loginContainer = document.getElementById("loginContainer");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

// Cambiar entre Login y Registro
showRegister.addEventListener("click", () => {
    loginContainer.classList.add("d-none");
    registerContainer.classList.remove("d-none");
});

showLogin.addEventListener("click", () => {
    registerContainer.classList.add("d-none");
    loginContainer.classList.remove("d-none");
});

// REGISTRO DE USUARIO
document.getElementById("registerBtn").addEventListener("click", async () => {
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const role = document.getElementById("registerRole").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Guardamos el rol en Firestore
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            role: role
        });

        alert("Usuario registrado con éxito. Ahora puedes iniciar sesión.");
        showLogin.click();
    } catch (error) {
        alert(error.message);
    }
});

// INICIO DE SESIÓN
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtener datos del usuario desde Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("Rol del usuario:", userData.role);

          if (userData.role === "admin") {
              window.location.href = "admin_dashboard.html";
          } else {
              window.location.href = "user_dashboard.html";
          }
      } else {
          alert("Error: No se encontraron datos del usuario.");
      }
  } catch (error) {
      alert(error.message);
  }
});


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

// Obtener elementos del DOM con verificación de existencia
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userRoleDisplay = document.getElementById("userRoleDisplay");

const registerSection = registerBtn ? registerBtn.parentElement : null;
const loginSection = loginBtn ? loginBtn.parentElement : null;

// 🔹 REGISTRO DE USUARIO CON ROL 🔹
if (registerBtn) {
  registerBtn.addEventListener("click", async () => {
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
    } catch (error) {
      console.error("Error en el registro:", error.message);
      alert(error.message);
    }
  });
}

// 🔹 INICIO DE SESIÓN 🔹
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtenemos el rol del usuario desde Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        userRoleDisplay.textContent = `Rol: ${userData.role}`;
        updateUI(user, userData.role); // Llamamos a updateUI con el rol

        // 🔀 Redirigir según el rol
        if (userData.role === "admin") {
          window.location.href = "admin_dashboard.html";
        } else {
          window.location.href = "user_dashboard.html";
        }
      } else {
        console.error("No se encontró el documento del usuario.");
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error.message);
      alert(error.message);
    }
  });
}

// 🔹 CIERRE DE SESIÓN 🔹
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      alert("Sesión cerrada.");
      updateUI(null);
      window.location.href = "index.html"; // Volver a la página principal
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  });
}

// 🔹 VERIFICACIÓN DE USUARIO ACTIVO 🔹
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      updateUI(user, userData.role);

      // 🔀 Redirigir automáticamente al dashboard si ya está autenticado
      if (window.location.pathname === "/index.html") {
        if (userData.role === "admin") {
          window.location.href = "admin_dashboard.html";
        } else {
          window.location.href = "user_dashboard.html";
        }
      }
    }
  } else {
    updateUI(null);
  }
});

// 🔹 ACTUALIZAR UI SEGÚN EL ESTADO DEL USUARIO 🔹
function updateUI(user, role = "") {
  if (user) {
    userRoleDisplay.textContent = `Rol: ${role}`;
    if (registerSection) registerSection.style.display = "none";  
    if (loginSection) loginSection.style.display = "none";     
    if (logoutBtn) logoutBtn.classList.remove("d-none");    
  } else {
    if (registerSection) registerSection.style.display = "block"; 
    if (loginSection) loginSection.style.display = "block";    
    if (logoutBtn) logoutBtn.classList.add("d-none");       
    userRoleDisplay.textContent = "";
  }
}

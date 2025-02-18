import { auth, db } from "./firebase_config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Verificar sesión activa y rol
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("Usuario autenticado:", user.email, "Rol:", userData.role);

        // Verificar si el usuario está en la página correcta
        const isAdmin = userData.role === "admin";
        const isAdminPage = window.location.pathname.includes("admin_dashboard.html");
        const isUserPage = window.location.pathname.includes("user_dashboard.html");

        if (isAdmin && !isAdminPage) {
            window.location.href = "admin_dashboard.html";
        } else if (!isAdmin && !isUserPage) {
            window.location.href = "user_dashboard.html";
        }
    } else {
        alert("Error: No se encontraron datos del usuario.");
        window.location.href = "index.html";
    }
});

// Cerrar sesión
document.getElementById("logoutBtn").addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
});
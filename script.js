
function toggleMenu() {
    document.getElementById("navigation")
        .classList.toggle("active");
}

document.getElementById("year").textContent =
    new Date().getFullYear();

function login() {
    const role = document.getElementById("role").value;
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("login-message");

    if (!username || !password) {
        message.textContent = "Please enter username and password.";
        message.style.color = "red";
        return;
    }

    // ADMIN LOGIN - DEMO ONLY
    if (
        role === "admin" &&
        username === "admin" &&
        password === "School@123"
    ) {
        sessionStorage.setItem("gs_admin_logged_in", "true");

        window.location.href = "admin.html";
        return;
    }

    message.textContent = "Invalid login credentials!";
    message.style.color = "red";
}

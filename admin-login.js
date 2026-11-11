
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    // DEMO ONLY: not secure authentication
    if (username === "admin" && password === "School@123") {

        sessionStorage.setItem("gs_admin_logged_in", "true");

        message.style.color = "green";
        message.textContent = "Login successful!";

        window.location.href = "admin.html";

    } else {
        message.style.color = "red";
        message.textContent = "Incorrect username or password!";
    }
});

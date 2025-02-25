import { auth } from "./firebase-config.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

// Function to show modal messages with color coding
function showModal(title, message, isSuccess) {
    const modalTitle = document.getElementById("modalTitle");
    const modalMessage = document.getElementById("modalMessage");

    modalTitle.innerText = title;
    modalMessage.innerText = message;

    // Apply color based on success or error
    modalTitle.style.color = isSuccess ? "green" : "red";
    modalMessage.style.color = isSuccess ? "green" : "red";

    let modal = new bootstrap.Modal(document.getElementById("messageModal"));
    modal.show();
}

// Function to validate email format
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Function to validate password
function isValidPassword(password) {
    return password.length >= 6; // Firebase requires at least 6 characters
}

// Sign up user
window.signUp = function () {
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    if (!isValidEmail(email)) {
        showModal("Error", "Please enter a valid email address.", false);
        return;
    }

    if (!isValidPassword(password)) {
        showModal("Error", "Password must be at least 6 characters long.", false);
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            showModal("Success", "Signup Successful!", true);
            setTimeout(() => {
                window.location.href = "dashboard.html"; // Redirect after modal
            }, 2000);
        })
        .catch((error) => showModal("Error", error.message, false));
};

// Login user
window.login = function () {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!isValidEmail(email)) {
        showModal("Error", "Please enter a valid email address.", false);
        return;
    }

    if (!isValidPassword(password)) {
        showModal("Error", "Invalid password. Must be at least 6 characters long.", false);
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            showModal("Success", "Login Successful!", true);
            setTimeout(() => {
                window.location.href = "dashboard.html"; // Redirect after modal
            }, 2000);
        })
        .catch((error) => showModal("Error", error.message, false));
};

// Logout user
window.logout = function () {
    signOut(auth)
        .then(() => {
            showModal("Success", "Logged Out!", true);
            setTimeout(() => {
                window.location.href = "login.html"; // Redirect after modal
            }, 2000);
        })
        .catch((error) => showModal("Error", error.message, false));
};

// Check authentication status and redirect if needed
function checkAuth() {
    onAuthStateChanged(auth, (user) => {
        const isDashboard = window.location.pathname.includes("dashboard.html");

        if (isDashboard && !user) {
            window.location.href = "login.html"; // Redirect to login if not authenticated
        }
    });
}

// Run authentication check on page load
checkAuth();

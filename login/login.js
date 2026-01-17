import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDsc-64x3eq9bZ-hQAGz7a7INsBDRSqF4w",
    authDomain: "new-project-1d853.firebaseapp.com",
    projectId: "new-project-1d853",
    storageBucket: "new-project-1d853.firebasestorage.app",
    messagingSenderId: "1093376377124",
    appId: "1:1093376377124:web:70ecf5eeba7bfa573473b1",
    measurementId: "G-CZR721JW15"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

function redirectToProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get('returnUrl');

    if (returnUrl) {
        window.location.href = decodeURIComponent(returnUrl);
    } else {
        window.location.href = 'profile.html';
    }
}

/**
@param {Object} user 
@param {string} displayName 
 */
function storeUserInfo(user, displayName = null) {
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userName', displayName || user.displayName || 'User');
    localStorage.setItem('userUid', user.uid);
    localStorage.setItem('isLoggedIn', 'true');
}

/**
 * @param {string} currentPageUrl
 */
export function goToLogin(currentPageUrl = null) {
    const loginUrl = 'login.html';
    if (currentPageUrl) {
        window.location.href = `${loginUrl}?returnUrl=${encodeURIComponent(currentPageUrl)}`;
    } else {
        window.location.href = loginUrl;
    }
}

/**
 * @returns {boolean}
 */
export function isUserLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

/**
 * @returns {Object|null}
 */
export function getCurrentUser() {
    if (!isUserLoggedIn()) return null;
    return {
        email: localStorage.getItem('userEmail'),
        name: localStorage.getItem('userName'),
        uid: localStorage.getItem('userUid')
    };
}

/**
 * Handles user icon click - redirects to profile if logged in, otherwise to login
 * @param {string} basePath - The relative path to the login folder (e.g., 'login/' or '../login/')
 */
export function handleUserIconClick(basePath = 'login/') {
    if (isUserLoggedIn()) {
        window.location.href = `${basePath}profile.html`;
    } else {
        window.location.href = `${basePath}login.html`;
    }
}

/**
 * @param {string} basePath
 */
export function setupUserIconNavigation(basePath = 'login/') {
    document.addEventListener('DOMContentLoaded', () => {
        const userIcon = document.querySelector('.nav-icons .fa-user');
        if (userIcon) {
            const parentLink = userIcon.closest('a');
            if (parentLink) {
                parentLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    handleUserIconClick(basePath);
                });
            } else {
                userIcon.style.cursor = 'pointer';
                userIcon.addEventListener('click', () => {
                    handleUserIconClick(basePath);
                });
            }
        }
    });
}

export { auth };

const loginContainer = document.getElementById('login-container');
const signupContainer = document.getElementById('signup-container');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');

showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.classList.add('hidden');
    signupContainer.classList.remove('hidden');
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
});

const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    loginError.textContent = '';

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        storeUserInfo(user);
        redirectToProfile();
    } catch (error) {
        const errorCode = error.code;
        let errorMessage = 'Login failed. Please try again.';

        if (errorCode === 'auth/user-not-found') {
            errorMessage = 'No account found with this email.';
        } else if (errorCode === 'auth/wrong-password') {
            errorMessage = 'Incorrect password.';
        } else if (errorCode === 'auth/invalid-email') {
            errorMessage = 'Invalid email address.';
        } else if (errorCode === 'auth/invalid-credential') {
            errorMessage = 'Invalid email or password.';
        }

        loginError.textContent = errorMessage;
    }
});

const signupForm = document.getElementById('signup-form');
const signupError = document.getElementById('signup-error');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    signupError.textContent = '';

    if (password !== confirmPassword) {
        signupError.textContent = 'Passwords do not match.';
        return;
    }

    if (password.length < 6) {
        signupError.textContent = 'Password must be at least 6 characters.';
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, {
            displayName: name
        });
        storeUserInfo(user, name);
        redirectToProfile();
    } catch (error) {
        const errorCode = error.code;
        let errorMessage = 'Signup failed. Please try again.';

        if (errorCode === 'auth/email-already-in-use') {
            errorMessage = 'An account with this email already exists.';
        } else if (errorCode === 'auth/invalid-email') {
            errorMessage = 'Invalid email address.';
        } else if (errorCode === 'auth/weak-password') {
            errorMessage = 'Password is too weak.';
        }

        signupError.textContent = errorMessage;
    }
});
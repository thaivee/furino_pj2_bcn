import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

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
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('user-name').textContent = user.displayName || 'User';
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('user-id').textContent = user.uid.substring(0, 12) + '...';
        
        const creationTime = user.metadata.creationTime;
        if (creationTime) {
            const date = new Date(creationTime);
            document.getElementById('member-since').textContent = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    } else {
        window.location.href = 'login.html';
    }
});

document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userUid');
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
});
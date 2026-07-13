// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// ১. আপনার ফায়ারবেস কনফিগারেশন
const firebaseConfig = {
  apiKey: "AIzaSyB3Qn-PyJ69cqWcwIMZw35idL0Gbgiy2Ec",
  authDomain: "digitalservicebd.firebaseapp.com",
  projectId: "digitalservicebd",
  storageBucket: "digitalservicebd.firebasestorage.app",
  messagingSenderId: "925779374891",
  appId: "1:925779374891:web:717fb2944ad76bcc3dcb6e"
};

// ২. ইনিশিয়ালাইজেশন
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * ৩. এক্সেস কন্ট্রোল ফাংশন
 * এটি চেক করবে ইউজার লগইন আছে কিনা এবং তার সঠিক পারমিশন আছে কিনা।
 * পাশাপাশি অফিসারের UID লোকাল স্টোরেজে সেভ করবে।
 */
export function checkAccess(requiredRole) {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            if (!window.location.pathname.includes('index.html')) {
                window.location.href = 'index.html';
            }
            return;
        }

        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                
                // গ্লোবাল লোকাল স্টোরেজ আপডেট (সব ফাইলের জন্য এটি খুব জরুরি)
                localStorage.setItem('userUid', user.uid); // এটিই অফিসার আইডি হিসেবে কাজ করবে
                localStorage.setItem('userRole', userData.role);
                localStorage.setItem('branchId', userData.branchId);
                localStorage.setItem('userName', userData.name);

                // রোল বা পারমিশন চেক
                if (requiredRole && userData.role !== requiredRole) {
                    if (userData.role !== 'owner') {
                        alert("আপনার এই পেজটি দেখার অনুমতি নেই!");
                        window.location.href = 'index.html';
                    }
                }
            } else {
                handleLogout();
            }
        } catch (error) {
            console.error("Access Error:", error);
        }
    });
}

/**
 * ৪. লগআউট ফাংশন
 */
export function handleLogout() {
    signOut(auth).then(() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = 'index.html';
    });
}

export { auth, db, signInWithEmailAndPassword };
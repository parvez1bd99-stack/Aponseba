// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, addDoc, updateDoc, query, where, onSnapshot, getDocs, runTransaction, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// ফায়ারবেস কনফিগারেশন (আপনার প্রজেক্টের আসল তথ্য)
const firebaseConfig = {
  apiKey: "AIzaSyB3Qn-PyJ69cqWcwIMZw35idL0Gbgiy2Ec",
  authDomain: "digitalservicebd.firebaseapp.com",
  projectId: "digitalservicebd",
  storageBucket: "digitalservicebd.firebasestorage.app",
  messagingSenderId: "925779374891",
  appId: "1:925779374891:web:717fb2944ad76bcc3dcb6e"
};

// ইনিশিয়ালাইজেশন
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * সিকিউরিটি ও রোল চেকার ফাংশন
 */
export function checkAccess(requiredRole = null) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
        window.location.href = 'index.html';
      }
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        localStorage.setItem('userUid', user.uid);
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userName', userData.name || 'User');
        localStorage.setItem('branchId', userData.branchId || 'main');

        // রোল অনুযায়ী রিডাইরেক্ট বা অনুমতি যাচাই
        if (requiredRole && userData.role !== requiredRole && userData.role !== 'owner') {
          alert("আপনার এই পেজে প্রবেশের অনুমতি নেই!");
          window.location.href = userData.role === 'owner' ? 'admin.html' : 'officer.html';
        }
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Access Check Error:", error);
    }
  });
}

/**
 * লগআউট ফাংশন
 */
export function handleLogout() {
  signOut(auth).then(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'index.html';
  });
}

export { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  onSnapshot, 
  getDocs, 
  runTransaction, 
  serverTimestamp 
};
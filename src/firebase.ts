import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, deleteDoc, onSnapshot, query, where, orderBy, Timestamp, getDocFromServer } from 'firebase/firestore';

// Note: In a real app, these would come from firebase-applet-config.json
// Since the automated tool is having issues, we'll use a placeholder structure
// and ask the user to provide their config if they have one, or I'll try to re-run setup.
// For now, I will define the structure and wait for the platform to provide the real config.

const firebaseConfig = {
  apiKey: "AIzaSyDUdrclPojGvXS_dZqrzxNqspCUsWMKh34",
  authDomain: "ai-app-a9c6f.firebaseapp.com",
  databaseURL: "https://ai-app-a9c6f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ai-app-a9c6f",
  storageBucket: "ai-app-a9c6f.firebasestorage.app",
  messagingSenderId: "23032572742",
  appId: "1:23032572742:web:c523f29140e94cf66d9347"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };

export { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  getDocFromServer
};
export type { User };

// Connection test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    }
  }
}
testConnection();

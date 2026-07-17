import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDILPxexEifVI-UVv1q1KsgTnSPqKZLy9s",
  authDomain: "ml-adira.firebaseapp.com",
  projectId: "ml-adira",
  storageBucket: "ml-adira.firebasestorage.app",
  messagingSenderId: "515387660982",
  appId: "1:515387660982:web:47f03ca553bf19c26d6417",
  measurementId: "G-HZJ9DS0MTP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "portal");

async function cleanup() {
  console.log("Starting cleanup...");
  const q = collection(db, 'portal_candidates');
  const snapshot = await getDocs(q);
  
  let deletedCount = 0;
  
  for (const document of snapshot.docs) {
    // If the ID starts with 'cand-', it's a fake duplicated ID from the bug
    if (document.id.startsWith('cand-')) {
      console.log(`Deleting duplicate document with ID: ${document.id}`);
      await deleteDoc(doc(db, 'portal_candidates', document.id));
      deletedCount++;
    }
  }
  
  console.log(`Cleanup finished! Deleted ${deletedCount} duplicate mock candidates.`);
  process.exit(0);
}

cleanup();

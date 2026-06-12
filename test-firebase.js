import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRScoq2DEaVi5TFtA8VK_ukHrNRDLbLmU",
  authDomain: "ratingfilm-1325d.firebaseapp.com",
  projectId: "ratingfilm-1325d",
  storageBucket: "ratingfilm-1325d.firebasestorage.app",
  messagingSenderId: "423052456129",
  appId: "1:423052456129:web:5c614843a3e9b6ce5e6440"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  try {
    const querySnapshot = await getDocs(collection(db, "ratings"));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    console.log("Total ratings in DB:", data.length);
    if (data.length > 0) {
      console.log("Sample rating:", JSON.stringify(data[0], null, 2));
    }
  } catch (err) {
    console.error("Error reading from Firestore:", err.message);
  }
}

test();

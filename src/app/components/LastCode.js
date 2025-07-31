import { doc, runTransaction, collection, addDoc } from "firebase/firestore";
import { db } from "../../../utils/firebaseConfig";

// Function to get next code
export const getNextXeroxCode = async () => {
  const counterRef = doc(db, "xeroxCenters", "code");

  const newCode = await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);

    let lastCode = 0;
    if (counterDoc.exists()) {
      lastCode = counterDoc.data().lastCode || 0;
    }

    const nextCode = lastCode + 1;

    transaction.update(counterRef, { lastCode: nextCode });

    // Return code in 4-digit padded format
    return String(nextCode).padStart(4, "0");
  });

  return newCode;
};

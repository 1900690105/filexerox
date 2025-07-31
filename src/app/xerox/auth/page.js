"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc, runTransaction } from "firebase/firestore";
import { auth, db } from "../../../../utils/firebaseConfig";

const getNextXeroxCode = async () => {
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

export default function XeroxAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    centerName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        // 🔐 Login
        const userCredential = await signInWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );
        const user = userCredential.user;

        const docRef = doc(db, "xeroxCenters", user.uid);
        const docSnap = await getDoc(docRef);

        setSuccess(
          `Welcome back, ${docSnap.data()?.centerName || "Xerox User"}!`
        );
        window.location.href = `/xerox/${docSnap.data().code}`;
      } else {
        // 📝 Sign Up
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );
        const user = userCredential.user;

        const code = await getNextXeroxCode();
        // 🔥 Add centerName to Firestore
        await setDoc(doc(db, "xeroxCenters", user.uid), {
          centerName: form.centerName,
          email: form.email,
          code: code,
        });

        setSuccess("Sign-up successful! You can now log in.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Xerox Center Login" : "Xerox Center Sign Up"}
        </h2>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block mb-1 font-medium">Center Name</label>
              <input
                type="text"
                name="centerName"
                value={form.centerName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          )}

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              suppressHydrationWarning
              current-password="true"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="text-blue-600 font-semibold"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

import { initializeApp, getApps, getApp } from "firebase/app";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";

import firebaseConfig from "../firebaseConfig";

// Alustetaan Firebase-sovellus
const app = getApps().length > 0
  ? getApp()
  : initializeApp(firebaseConfig);

// Otetaan Firebase Authentication käyttöön
export const auth = getAuth(app);

// Kirjautuminen
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

// Rekisteröityminen
export const registerWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
}; 

// Uloskirjautuminen
export const logout = async (): Promise<void> => {
  await signOut(auth);
};
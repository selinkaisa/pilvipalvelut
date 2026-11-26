import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";

import firebaseConfig from "../firebaseConfig";

const app = getApps().length > 0
  ? getApp()
  : initializeApp(firebaseConfig);


export const auth = getAuth(app);


export const db = getFirestore(app);


export const loginWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};


export const registerWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
}; 


export const logout = async (): Promise<void> => {
  await signOut(auth);
};
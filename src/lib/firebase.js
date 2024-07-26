import { initializeApp,getApps,getApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: "apwraigarh-1dcef",
  storageBucket: "apwraigarh-1dcef.appspot.com",
  messagingSenderId: "532357797952",
  appId: "1:532357797952:web:9e12f461e2e1a68ea367a5"
};

const app = !getApps().length ?initializeApp(firebaseConfig):getApp();
export const database = getDatabase(app);
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  "projectId": "studio-874395008-ab6df",
  "appId": "1:512442840677:web:02978f36af43df4d33f88c",
  "apiKey": "AIzaSyBvVTw8gLhmNCwh45hrE7_QJU-YEagI6Ks",
  "authDomain": "studio-874395008-ab6df.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "512442840677"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

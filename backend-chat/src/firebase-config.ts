import admin from "firebase-admin";
var serviceAccount = require("../firebase-acc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "*Sua URL Firestore*", 
});

export const db = admin.firestore();

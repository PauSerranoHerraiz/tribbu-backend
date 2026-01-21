const admin = require("firebase-admin");
const path = require("path");
let credential;

try {
  credential = require(path.join(__dirname, "../service-account.json"));
} catch {
  credential = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),

  };
}

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(credential) });
}

module.exports = admin;
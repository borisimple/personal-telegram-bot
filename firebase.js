const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: process.env.FIREBASE_COINRANKINGPP_DB_URL,
});

const db = admin.firestore();

async function updatePercentage(pct) {
  const objectToUpdate = await db.collection("prediction");
  const objectRef = await db.collection("prediction").get();
  objectRef.forEach((record) => {
    objectToUpdate.doc(record.id).set({ percentage: pct, date: new Date() });
  });
}

module.exports.updatePercentage = updatePercentage;

const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const logger = require("firebase-functions/logger");

initializeApp();
const db = getFirestore();

// Set these once via: firebase functions:secrets:set SMS4FREE_KEY (etc.)
// Never put real values in this file or in git.
const SMS4FREE_KEY = defineSecret("SMS4FREE_KEY");
const SMS4FREE_USER = defineSecret("SMS4FREE_USER");
const SMS4FREE_PASS = defineSecret("SMS4FREE_PASS");
const SMS4FREE_SENDER = defineSecret("SMS4FREE_SENDER");

// Send a parent SMS every time a student's quiz score crosses another
// multiple of this number (10, 20, 30, ...).
const MILESTONE_STEP = 10;

function countCorrect(sections) {
  if (!sections) return 0;
  return Object.values(sections).filter(Boolean).length;
}

async function sendSms({ key, user, pass, sender, recipient, msg }) {
  const res = await fetch("https://api.sms4free.co.il/ApiSMS/v2/SendSMS", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, user, pass, sender, recipient, msg }),
  });
  const data = await res.json();
  if (!(data.status > 0)) {
    throw new Error(`SMS4Free error ${data.status}: ${data.message}`);
  }
  return data;
}

// Fires on every write to a user's quiz-progress doc (users/{uid}/progress/quiz),
// which quiz.js updates each time a question is answered correctly for the
// first time. Compares the score before/after the write; if it just crossed
// a new MILESTONE_STEP multiple, texts the parents.
exports.notifyParentsOnQuizMilestone = onDocumentWritten(
  {
    document: "users/{uid}/progress/quiz",
    secrets: [SMS4FREE_KEY, SMS4FREE_USER, SMS4FREE_PASS, SMS4FREE_SENDER],
  },
  async (event) => {
    const uid = event.params.uid;
    const before = event.data.before.exists ? event.data.before.data() : null;
    const after = event.data.after.exists ? event.data.after.data() : null;
    if (!after) return;

    const prevScore = countCorrect(before?.sections);
    const newScore = countCorrect(after.sections);
    if (newScore <= prevScore) return;

    const prevMilestone = Math.floor(prevScore / MILESTONE_STEP) * MILESTONE_STEP;
    const newMilestone = Math.floor(newScore / MILESTONE_STEP) * MILESTONE_STEP;
    if (newMilestone <= prevMilestone || newMilestone === 0) return;

    const userSnap = await db.collection("users").doc(uid).get();
    if (!userSnap.exists) return;
    const userData = userSnap.data();
    const recipients = [userData.fatherPhone, userData.motherPhone].filter(Boolean);
    if (recipients.length === 0) return;

    const fullName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim();
    const msg = `${fullName}: ${newMilestone} נקודות בשיעורי "ארבעה אבות" 🎉`;

    try {
      await sendSms({
        key: SMS4FREE_KEY.value(),
        user: SMS4FREE_USER.value(),
        pass: SMS4FREE_PASS.value(),
        sender: SMS4FREE_SENDER.value(),
        recipient: recipients.join(";"),
        msg,
      });
      logger.info(`Notified parents of ${uid} at ${newMilestone} points`);
    } catch (err) {
      logger.error(`Failed to notify parents of ${uid} at ${newMilestone} points`, err);
    }
  }
);

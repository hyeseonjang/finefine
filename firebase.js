// Realtime Database only. Keep this optional so the game still works when
// Firebase is not configured yet.
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

let databasePromise = null;

function hasFirebaseConfig() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.databaseURL);
}

async function getRealtimeDatabase() {
  if (!hasFirebaseConfig()) return null;

  if (!databasePromise) {
    databasePromise = Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js")
    ]).then(([appModule, databaseModule]) => {
      const app = appModule.initializeApp(firebaseConfig);
      return {
        database: databaseModule.getDatabase(app),
        databaseModule
      };
    });
  }

  return databasePromise;
}

export async function saveScore(score, name = "player") {
  try {
    const realtime = await getRealtimeDatabase();
    if (!realtime || score <= 0) return false;

    const safeName = String(name || "player").trim().slice(0, 20) || "player";
    const scoresRef = realtime.databaseModule.ref(realtime.database, "scores");
    const newScoreRef = realtime.databaseModule.push(scoresRef);

    await realtime.databaseModule.set(newScoreRef, {
      name: safeName,
      score,
      createdAt: realtime.databaseModule.serverTimestamp()
    });

    return true;
  } catch (error) {
    console.warn("Realtime Database score save skipped:", error);
    return false;
  }
}

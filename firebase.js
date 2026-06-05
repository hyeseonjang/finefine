// Keep Firebase optional and small. Add your Firebase config here only when you
// need Analytics, Firestore, Auth, or another product.
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

export async function initFirebase() {
  if (!firebaseConfig.apiKey) return null;

  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js");
  return initializeApp(firebaseConfig);
}

initFirebase();


"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  collection 
} from "firebase/firestore";
import { getDatabase, ref, set, push } from "firebase/database";
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";

import type { User, Admin, EmergencyContact, LiveLocation } from "./definitions";

// This is a server-side only Firebase instance.
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, // This was missing
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize the server-side app instance, or get it if it already exists.
const serverApp = !getApps().some(app => app.name === 'server') 
  ? initializeApp(firebaseConfig, "server") 
  : getApp("server");
  
const db = getFirestore(serverApp);
const realtimeDB = getDatabase(serverApp);


const COOKIE_NAME = "guardianangel-session";

// --- AUTH ACTIONS ---

async function createSession(user: User | Admin) {
  const sessionData = { user, isLoggedIn: true };
  cookies().set(COOKIE_NAME, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // One week
    path: "/",
  });
}

export async function loginAsUser(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const adminId = formData.get("adminId") as string;

  if (!name || !phone || !adminId) {
    return { error: "Please fill in all fields." };
  }

  // Check if admin exists
  const adminRef = doc(db, "admins", adminId);
  const adminSnap = await getDoc(adminRef);
  if (!adminSnap.exists()) {
    return { error: "Invalid Admin ID. This admin does not exist." };
  }

  const userId = `user_${phone}`;
  const user: User = {
    id: userId,
    name,
    phone,
    role: "user",
    adminId,
  };

  await setDoc(doc(db, "users", user.id), user);
  await createSession(user);
  revalidatePath("/");
  redirect("/dashboard");
}

export async function loginAsAdmin(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const adminId = formData.get("adminId") as string;

  if (!name || !adminId) {
    return { error: "Please fill in all fields." };
  }

  const admin: Admin = {
    id: adminId,
    name,
    phone: "N/A", // Admin phone not used in this flow
    role: "admin",
  };

  await setDoc(doc(db, "admins", admin.id), admin);
  await createSession(admin);
  revalidatePath("/");
  redirect("/admin");
}

export async function logout() {
  cookies().delete(COOKIE_NAME);
  redirect("/");
}

// --- USER ACTIONS ---

async function getSession() {
  const cookie = cookies().get(COOKIE_NAME);
  if (!cookie) return null;
  try {
    return JSON.parse(cookie.value);
  } catch {
    return null;
  }
}

export async function triggerSOS(message: string, location: LiveLocation | null) {
  const session = await getSession();
  if (session?.user?.role !== "user") {
    return { error: "Unauthorized" };
  }
  const user = session.user as User;

  if (!location) {
    return { error: "Location not available. Please enable GPS." };
  }

  const alertData = {
    userId: user.id,
    userName: user.name,
    userPhone: user.phone,
    location: {
        latitude: location.latitude,
        longitude: location.longitude,
    },
    message: message || `EMERGENCY! Help needed.`,
    timestamp: Date.now(),
    status: "active",
  };

  const alertsRef = ref(realtimeDB, `alerts/${user.adminId}`);
  await push(alertsRef, alertData);

  // Here you would trigger a cloud function to send SMS/email
  console.log("SOS Triggered. In a real app, notifications would be sent.");

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateLocation(location: {
  latitude: number;
  longitude: number;
  accuracy: number;
}) {
  const session = await getSession();
  if (session?.user?.role !== "user") return;
  const user = session.user as User;

  const locationData = { ...location, updatedAt: Date.now() };
  await set(ref(realtimeDB, `liveLocations/${user.id}`), locationData);
}

// --- CONTACTS ACTIONS ---

export async function addContact(formData: FormData) {
  const session = await getSession();
  if (session?.user?.role !== "user") {
    return { error: "Unauthorized" };
  }
  const user = session.user as User;

  const name = formData.get("name") as string;
  const phoneOrEmail = formData.get("phoneOrEmail") as string;

  if (!name || !phoneOrEmail) {
    return { error: "Please provide both name and contact info." };
  }

  const contactsCollectionRef = collection(db, "users", user.id, "contacts");
  await addDoc(contactsCollectionRef, { name, phoneOrEmail });

  revalidatePath("/dashboard");
  return { success: "Contact added successfully." };
}

export async function getContacts(): Promise<EmergencyContact[]> {
  const session = await getSession();
  if (session?.user?.role !== "user") {
    return [];
  }
  const user = session.user as User;

  const contactsCollectionRef = collection(db, "users", user.id, "contacts");
  const snapshot = await getDocs(contactsCollectionRef);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as EmergencyContact[];
}

export async function removeContact(id: string) {
    const session = await getSession();
    if (session?.user?.role !== "user") {
        return { error: "Unauthorized" };
    }
    const user = session.user as User;

    const contactDocRef = doc(db, "users", user.id, "contacts", id);
    await deleteDoc(contactDocRef);

    revalidatePath("/dashboard");
    return { success: "Contact removed." };
}

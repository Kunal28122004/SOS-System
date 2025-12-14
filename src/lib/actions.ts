
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { adminDb, adminRtdb } from "./firebase-admin";

import type { User, Admin, EmergencyContact, LiveLocation } from "./definitions";

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
  if (!adminDb) {
    return { error: "Firebase Admin is not configured." };
  }
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const adminId = formData.get("adminId") as string;

  if (!name || !phone || !adminId) {
    return { error: "Please fill in all fields." };
  }

  // Check if admin exists
  const adminRef = adminDb.collection("admins").doc(adminId);
  const adminSnap = await adminRef.get();
  if (!adminSnap.exists) {
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

  await adminDb.collection("users").doc(user.id).set(user);
  await createSession(user);
  revalidatePath("/");
  redirect("/dashboard");
}

export async function loginAsAdmin(prevState: any, formData: FormData) {
    if (!adminDb) {
        return { error: "Firebase Admin is not configured." };
    }
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

  await adminDb.collection("admins").doc(admin.id).set(admin);
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
  if (!adminRtdb) {
    return { error: "Firebase Admin is not configured." };
  }
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

  const alertsRef = adminRtdb.ref(`alerts/${user.adminId}`);
  await alertsRef.push(alertData);

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
    if (!adminRtdb) return;
  const session = await getSession();
  if (session?.user?.role !== "user") return;
  const user = session.user as User;

  const locationData = { ...location, updatedAt: Date.now() };
  await adminRtdb.ref(`liveLocations/${user.id}`).set(locationData);
}

// --- CONTACTS ACTIONS ---

export async function addContact(formData: FormData) {
    if (!adminDb) {
        return { error: "Firebase Admin is not configured." };
    }
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

  const contactsCollectionRef = adminDb.collection("users").doc(user.id).collection("contacts");
  await contactsCollectionRef.add({ name, phoneOrEmail });

  revalidatePath("/dashboard");
  return { success: "Contact added successfully." };
}

export async function getContacts(): Promise<EmergencyContact[]> {
    if (!adminDb) {
        return [];
    }
  const session = await getSession();
  if (session?.user?.role !== "user") {
    return [];
  }
  const user = session.user as User;

  const contactsCollectionRef = adminDb.collection("users").doc(user.id).collection("contacts");
  const snapshot = await contactsCollectionRef.get();
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as EmergencyContact[];
}

export async function removeContact(id: string) {
    if (!adminDb) {
        return { error: "Firebase Admin is not configured." };
    }
    const session = await getSession();
    if (session?.user?.role !== "user") {
        return { error: "Unauthorized" };
    }
    const user = session.user as User;

    const contactDocRef = adminDb.collection("users").doc(user.id).collection("contacts").doc(id);
    await contactDocRef.delete();

    revalidatePath("/dashboard");
    return { success: "Contact removed." };
}

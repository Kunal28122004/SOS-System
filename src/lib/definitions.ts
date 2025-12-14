export type User = {
  id: string;
  name: string;
  phone: string;
  role: "user";
  adminId: string; // The admin this user is associated with
};

export type Admin = {
  id: string; // This is the 'adminCode' users will enter
  name: string;
  phone: string;
  role: "admin";
};

export type EmergencyContact = {
  id: string;
  name: string;
  phoneOrEmail: string;
};

export type SOSAlert = {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  location: {
    latitude: number;
    longitude: number;
  };
  message: string;
  timestamp: number;
  status: "active" | "resolved";
};

export type LiveLocation = {
  latitude: number;
  longitude: number;
  accuracy: number;
  updatedAt: number;
};

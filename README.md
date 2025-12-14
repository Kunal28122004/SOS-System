# GuardianAngel SOS - Personal Emergency Alert System

GuardianAngel SOS is a Next.js web application that provides a personal safety solution. It allows users to instantly send an SOS alert with their live location to a designated admin monitor, such as a security service or a family member.

## Key Features

-   **User & Admin Roles**: Separate login and dashboard experiences for standard users and monitoring admins.
-   **One-Press SOS**: A large, prominent SOS button for users to quickly send an alert in an emergency.
-   **Live Location Tracking**: Users' locations are tracked in real-time and displayed on the admin dashboard.
-   **Custom SOS Messages**: Users can include a custom message with their SOS alert.
-   **Emergency Contacts**: Users can manage a list of emergency contacts who would be notified (notification logic pending).
-   **Admin Dashboard**: Admins can view a list of active SOS alerts and monitor the live locations of all associated users.
-   **Real-time Alerts**: Built with Firebase Realtime Database for instantaneous alert and location updates.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore) & [Firebase Realtime Database](https://firebase.google.com/docs/database)
-   **Deployment**: Ready for Vercel or Firebase App Hosting

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### 1. Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later recommended)
-   `npm` or `yarn` or `pnpm`
-   A Firebase project.

### 2. Firebase Setup

1.  Create a project on the [Firebase Console](https://console.firebase.google.com/).
2.  Add a **Web App** to your Firebase project.
3.  Copy the Firebase configuration object provided. You will need these values for your environment variables.
4.  Enable **Firestore** and **Realtime Database**. For the Realtime Database, you will need its URL. You can find this in the Firebase Console under **Build > Realtime Database**.
5.  Generate a **Service Account** private key for server-side admin access. Go to Project Settings -> Service accounts, and click "Generate new private key".

### 3. Installation & Configuration

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repository-name.git
    cd your-repository-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of your project. Copy the contents of `.env.example` into it and fill in the values from your Firebase project. The `FIREBASE_SERVICE_ACCOUNT_KEY` should be the full JSON content of the file you downloaded in the previous step, string-escaped to fit on a single line.

    Your `.env.local` file should look like this:
    ```env
    # Firebase Public Keys (for client-side)
    NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
    NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
    NEXT_PUBLIC_FIREBASE_DATABASE_URL="https://your-project-id-default-rtdb.firebaseio.com"

    # Firebase Admin Key (for server-side)
    # This should be the full stringified JSON from your service account file.
    FIREBASE_SERVICE_ACCOUNT_KEY="..."
    ```

### 4. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser to see the application.

## How to Use

1.  **Admin Login**: Navigate to the homepage, select the "Admin" tab. The credentials are hardcoded for simplicity. Use `Admin` for the ID and `Admin123` for the password.
2.  **User Login**: Open a new browser or incognito window. On the homepage, select the "User" tab. Enter your name, phone number, and the Admin ID. The default admin ID created by the system is `city-pd`.
3.  **Trigger an SOS**: As the user, press the large "SOS" button. You can optionally add a custom message.
4.  **Monitor Alerts**: As the admin, you will see the SOS alert appear on your dashboard in real-time, along with the user's location and message.

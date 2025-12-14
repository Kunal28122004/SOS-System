# **App Name**: GuardianAngel

## Core Features:

- SOS Alert Trigger: Allow users to trigger an SOS alert with a single click, sending their location and a custom message to emergency contacts via Firebase.
- Real-time Location Tracking: Track user's location in real-time and update it in Firebase Realtime Database for admin monitoring.
- Emergency Contact Management: Enable users to add, remove, and manage emergency contacts to be notified during an SOS event, storing this data in Firestore.
- Admin Dashboard: Provide an admin interface to view and manage user locations and active SOS alerts in real-time.
- Backend Notifications: Use Firebase Cloud Functions to send SMS and email notifications to emergency contacts via Twilio and SendGrid upon triggering an SOS alert.
- User Authentication: Implement secure user authentication using Firebase Authentication with phone/email verification.

## Style Guidelines:

- Primary color: A vivid red (#E53935) to convey urgency and attention.
- Background color: Light gray (#F5F5F5) to ensure readability and a clean interface.
- Accent color: A muted orange (#FF7043), for secondary interactive elements like secondary buttons or highlights.
- Body and headline font: 'Inter', a versatile sans-serif for a modern and neutral feel.
- Use Font Awesome icons for a consistent and recognizable visual language.
- Maintain a clean and responsive layout using Bootstrap to ensure usability on different devices.
- Implement subtle animations, such as a pulsing effect on the SOS button, to draw attention and provide feedback.
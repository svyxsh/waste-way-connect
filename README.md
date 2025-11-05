CleanConnect - Modern Garbage Collection Management
CleanConnect is a full-stack web application designed to manage garbage collection by connecting residents, cleaners, and administrators on a single, efficient platform. It provides a role-based system for creating, assigning, and tracking waste pickup requests in real-time.

Features
The application provides a unique dashboard and set of features for each user role:

1. Resident Dashboard
Create Pickup Requests: Residents can submit new requests, including a description, an optional photo (which is compressed in-browser before upload), and a precise location selected from an interactive map.

Track Request Status: View a complete history of all submitted requests and track their current status (e.g., "Pending", "Assigned", "Completed").

View Details: See who their request is assigned to and view location details.

2. Cleaner Dashboard
Job Queue: View a dashboard of pickup requests that have been specifically assigned to them by an admin.

Request Details: Access all necessary information for a job, including the resident's name, request description, and a map of the pickup location.

Navigation: A "Navigate" button provides a direct link to Google Maps for the coordinates.

Mark Complete: Cleaners can mark jobs as "Completed" after finishing the pickup.

3. Admin Dashboard
Statistics: A high-level dashboard showing key metrics, including the total number of pending, assigned, and completed requests.

Manage All Requests: View and manage all requests submitted by all residents.

Assign Jobs: The primary function is to assign new "Pending" requests to an available cleaner from a dropdown list.

Tech Stack
This project is built using a modern web development stack:

Frontend: React & TypeScript

Build Tool: Vite

Backend & Database: Firebase

Firebase Authentication: For user sign-up, sign-in, and role management.

Firestore: NoSQL database for storing user profiles and garbage requests.

Firebase Storage: For uploading and hosting user-submitted photos.

Styling: Tailwind CSS with shadcn-ui for the component library.

Routing: React Router

State Management: React Query (TanStack Query) for server state and React Context for global auth state.

Mapping: Leaflet & React-Leaflet for interactive maps and location picking.

Forms: React Hook Form & Zod for form validation.

Utilities:

next-themes for light/dark mode.

browser-image-compression for client-side image optimization.

lucide-react for icons.

Getting Started
1. Prerequisites
Node.js (v18 or higher)

npm or Bun

A Firebase project with Authentication, Firestore, and Storage enabled.

2. Installation
Clone the repository:

Bash

git clone https://github.com/your-username/waste-way-connect.git
cd waste-way-connect
Install dependencies:

Bash

npm install
or

Bash

bun install
3. Firebase Configuration
The application requires Firebase credentials to run.

Create a .env file in the root of the project.

Go to your Firebase project settings and find your web app's configuration.

Add the following variables to your .env file, replacing the placeholders with your project's keys:

Code snippet

VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
Note: The application includes a check and will display a warning on the homepage if these Firebase variables are not configured.

4. Running the Project
Run the development server:

Bash

npm run dev
The application will be available at http://localhost:8080 (or another port if 8080 is in use).

Available Scripts
npm run dev: Starts the Vite development server with hot-reloading.

npm run build: Builds the application for production.

npm run lint: Lints the TypeScript and TSX files using ESLint.

npm run preview: Serves the production build locally for previewing.

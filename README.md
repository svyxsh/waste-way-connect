## 🗑️ CleanConnect — Project Description

CleanConnect is a full-stack web application designed to modernize and streamline garbage collection management.  
It connects **residents**, **cleaners**, and **administrators** on a single platform, enabling efficient request creation, assignment, tracking, and completion in real time.

The system uses a **role-based dashboard** approach:
- Residents can raise garbage pickup requests with location and photo support
- Admins manage and assign requests to cleaners
- Cleaners receive assigned jobs, navigate to pickup locations, and mark tasks as completed

By combining real-time status tracking, interactive maps, and cloud-based infrastructure, CleanConnect improves transparency, accountability, and efficiency in waste management workflows.

---

## Installation

```bash
git clone https://github.com/your-username/waste-way-connect.git
cd waste-way-connect
npm install
```

## Firebase Configuration

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

## Running the Project

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:8080
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

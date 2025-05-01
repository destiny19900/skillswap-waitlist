# SkillSwap - Waitlist Landing Page

A beautiful, Apple-inspired landing page for SkillSwap, a decentralized learning platform where people can learn, teach, and earn.

## About SkillSwap

SkillSwap is a fun, flexible, and rewarding learning platform where anyone can:
- 🧠 Learn real-world, everyday or tech skills
- 👩‍🏫 Teach what they know and earn credits or money
- 📹 Create short micro-courses or book 1-on-1 live sessions
- 🔄 Trade knowledge and grow a skill economy

## Features

- Modern, responsive design with Apple-inspired aesthetics
- Smooth scroll animations using Framer Motion
- Animated UI elements and micro-interactions
- Firebase integration for waitlist form
- Mobile-first approach with Tailwind CSS

## Tech Stack

- React + TypeScript
- Next.js
- Tailwind CSS
- Framer Motion
- Lottie Animations
- Firebase Firestore

## Getting Started

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Set up Firebase:
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Firestore database
   - Add your Firebase config to `.env.local` file (use `.env.local` template)

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `app/` - Next.js app router files
- `components/` - Reusable UI components
- `sections/` - Page sections (Hero, Features, etc.)
- `utils/` - Helper functions and Firebase config
- `assets/` - Images, Lottie animations, etc.

## Deployment

1. Build the project
   ```bash
   npm run build
   ```

2. Deploy to your preferred hosting provider (Vercel recommended for Next.js)

## License

MIT 
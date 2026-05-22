# Manthanam (मंथनम्) 🪷

Manthanam (formerly MoodMuse) is a premium, AI-powered journaling and mood tracking application. It combines mindful reflection with advanced AI insights to help users track their emotional well-being, uncover hidden patterns in their thoughts, and foster a balanced mental state. 

Designed with a rich, dynamic aesthetic and culturally inspired elements, Manthanam offers a sanctuary for your mind—your "Vichar" (विचार).

---

## 🌟 Key Features

- **AI-Powered Insights:** Uses Google's Generative AI (Gemini) to analyze journal entries and extract sentiments, predominant emotions, risk levels, and confidence scores.
- **Dynamic Mood Tracking:** Visualizes your emotional journey over time through interactive mood charts.
- **Smart Dashboard:** A beautifully designed, minimalist dashboard offering at-a-glance metrics like:
  - Average Stress Score
  - Top Emotion
  - Total Entries
  - AI Confidence
  - Risk Level
- **Premium UI/UX:** Features a dynamic ambient background with glassmorphism effects, custom SVG icons, and smooth micro-animations.
- **Secure Authentication:** User data and authentication are securely managed via Supabase.
- **Responsive Design:** Fully optimized for both desktop and mobile devices.

## 🛠️ Technology Stack

- **Frontend:** [React 18](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with custom utility animations
- **Icons:** [Lucide React](https://lucide.dev/)
- **Backend/BaaS:** [Supabase](https://supabase.com/) (Authentication & Database)
- **AI Integration:** [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) (Gemini API)

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/adarsh3321/MoodMuse.git
   cd MoodMuse
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your API keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```
   *(Note: Ensure your Supabase database has a `journal_entries` table with the appropriate schema matching the application's required structure).*

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173` (or the port specified by Vite).

## 📜 Scripts

- `npm run dev`: Starts the local development server.
- `npm run build`: Bundles the app for production.
- `npm run lint`: Runs ESLint to check for code quality.
- `npm run preview`: Previews the production build locally.
- `npm run typecheck`: Runs TypeScript compiler check.

## 👨‍💻 Author

Crafted by [Adarsh Kumar](https://github.com/adarsh3321).

# SangyanAI — AI Crisis Response Intelligence

SangyanAI is a premium, real-time, AI-powered crisis intelligence platform. It features a multi-agent AI pipeline designed to monitor global disasters in real-time, offering detection to response in under 400ms.

## Features

- **Interactive 3D Globe**: A real-time, interactive 3D representation of the world, highlighting active regions.
- **AI Agent Pipeline**: Features three distinct AI agents working in sequence:
  - **Monitor**: Scans data sources (USGS, Open-Meteo, NASA FIRMS).
  - **Analyzer**: Assesses threat levels and cross-references historical disaster patterns.
  - **Responder**: Generates action plans and notifies monitoring stations.
- **Live Explore View**: Search any region in the world to retrieve real-time simulated climate data, seismic status, and active alerts.
- **Premium UI/UX**: Designed with a sleek dark-themed aesthetics, glassmorphism, responsive fluid typography, and cinematic motion effects.

## Tech Stack

- **Frontend Framework**: React (via Vite)
- **Styling**: Vanilla CSS (Tailwind CSS v4 variables structure), Custom CSS Animations
- **3D Rendering**: Three.js, React Three Fiber, Drei
- **Icons**: Lucide React
- **Typography**: Outfit, Inter, JetBrains Mono

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone this repository:
   \`\`\`sh
   git clone https://github.com/adityagrinds/SangyanAI-2.git
   cd SangyanAI-2
   \`\`\`

2. Install dependencies:
   \`\`\`sh
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`sh
   npm run dev
   \`\`\`

4. Open your browser and navigate to \`http://localhost:5173\`.

## Project Structure

- \`src/components/Hero.jsx\`: Main landing page hero component.
- \`src/components/ExploreView.jsx\`: Interactive fullscreen map, search, and AI agent pipeline view.
- \`src/components/Globe3D.jsx\`: 3D Globe rendering component.
- \`src/index.css\`: Core design system, font imports, and animations.

## License

MIT License

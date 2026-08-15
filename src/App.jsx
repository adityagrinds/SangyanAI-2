import { useState } from 'react';
import Hero from './components/Hero';
import ExploreView from './components/ExploreView';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import ClickRipple from './components/ClickRipple';
import ScrollProgress from './components/ScrollProgress';
import Navbar from './components/Navbar';

export default function App() {
  const [showExplore, setShowExplore] = useState(false);

  return (
    <>
      {/* Global systems */}
      <CustomCursor />
      <ClickRipple />
      <ScrollProgress />

      {/* Navbar */}
      <Navbar />

      {/* Explore View (full-screen overlay) */}
      {showExplore && (
        <ExploreView onBack={() => setShowExplore(false)} />
      )}

      {/* Page */}
      <main>
        <Hero onExplore={() => setShowExplore(true)} />
      </main>

      <Footer />
    </>
  );
}

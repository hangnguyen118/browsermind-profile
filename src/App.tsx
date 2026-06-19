import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Experience } from './components/sections/Experience';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { Education } from './components/sections/Education';
import { Certificates } from './components/sections/Certificates';
import { Contact } from './components/sections/Contact';
import { ChatbotWidget } from './components/chatbot/ChatbotWidget';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent-500 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <Header />

      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Education />
        <Certificates />
        <Contact />
      </main>

      <Footer />

      {/* The transformers.js runtime is dynamically imported, so mounting this
          does not bloat the initial bundle — it loads on first chat open. */}
      <ChatbotWidget />
    </div>
  );
}

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';

import Dashboard from './components/Dashboard';
import FoodDatabase from './components/FoodDatabase';
import MealBuilder from './components/MealBuilder';
import Analytics from './components/Analytics';

// Get basename from PUBLIC_URL environment variable (set at build time)
// This ensures React Router knows about the sub-path when deployed behind a reverse proxy
const basename = process.env.PUBLIC_URL || '';

function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    return (
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    );
  };

  return (
    <ThemeProvider>
      <Router basename={basename}>
        <div className="app">
          <header className="app-header">
            <div className="container header-row">
              <div className="header-left">
                <h1>🍽️ Nom Nom Tracker</h1>
                <p>Track your daily food intake and macros</p>
              </div>
              <div className="header-actions">
                <ThemeToggle />
              </div>
            </div>
          </header>

          <nav className="app-nav">
            <div className="container">
              <Link
                to="/"
                className={activeTab === 'dashboard' ? 'active' : ''}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </Link>
              <Link
                to="/foods"
                className={activeTab === 'foods' ? 'active' : ''}
                onClick={() => setActiveTab('foods')}
              >
                Food Database
              </Link>
              <Link
                to="/meals"
                className={activeTab === 'meals' ? 'active' : ''}
                onClick={() => setActiveTab('meals')}
              >
                Meal Builder
              </Link>
              <Link
                to="/analytics"
                className={activeTab === 'analytics' ? 'active' : ''}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </Link>
            </div>
          </nav>

          <main className="container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/foods" element={<FoodDatabase />} />
              <Route path="/meals" element={<MealBuilder />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </main>

          <footer className="app-footer">
            <div className="container">
              <p>&copy; 2025 Nom Nom Tracker. Track with confidence.</p>
            </div>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

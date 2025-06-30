import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Attendance from './components/Attendance';
import Results from './components/Results';
import Timetable from './components/Timetable';
import { getCurrentUser } from './utils/storage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const user = getCurrentUser();
    setIsLoggedIn(!!user);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <Students />;
      case 'attendance':
        return <Attendance />;
      case 'results':
        return <Results />;
      case 'timetable':
        return <Timetable />;
      default:
        return <Dashboard />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import ContactsPage from './pages/ContactsPage';
import DealsPage from './pages/DealsPage';
import TasksPage from './pages/TasksPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

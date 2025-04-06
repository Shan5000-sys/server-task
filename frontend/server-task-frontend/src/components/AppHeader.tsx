import React from 'react';

const AppHeader: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="space-x-4">
        <a href="/" className="hover:underline">Home</a>
        <a href="/create" className="hover:underline">Create Task</a>
      </nav>
    </header>
  );
};

export default AppHeader;
import React from 'react';

const AppHeader: React.FC = () => {
  return (
    <header className="p-4 bg-white shadow">
      <nav className="space-x-4">
        <a href="/" className="hover:underline">Home</a>
        <a href="/create" className="hover:underline">Create Task</a>
      </nav>
    </header>
  );
};

export default AppHeader;
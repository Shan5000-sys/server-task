import React from 'react';

const AppHeader = () => {
  return (
    <header className="bg-gray-900 text-white p-4 flex space-x-4">
      <a href="/" className="hover:underline">Home</a>
      <a href="/create" className="hover:underline">Create Task</a>
    </header>
  );
};

export default AppHeader; // ✅ not `module.exports`
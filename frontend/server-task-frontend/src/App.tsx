import React from 'react';
import AppHeader from './components/AppHeader';
import CreateTask from './components/CreateTask';
import TaskList from './components/TaskList';
import TaskImageUploader from './components/TaskImageUploader';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="p-6 max-w-2xl mx-auto space-y-10">
        <CreateTask />
        <TaskList />
        <TaskImageUploader />
      </main>
    </div>
  );
}

export default App;

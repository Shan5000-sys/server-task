import React, { useState } from 'react';

const CreateTask: React.FC = () => {
  const [formData, setFormData] = useState({
    taskId: '',
    userId: '',
    title: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('https://u4e7e45gee.execute-api.ca-central-1.amazonaws.com/prod/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to create task');
      setMessage('✅ Task created!');
      setFormData({ taskId: '', userId: '', title: '', description: '' });
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow-md rounded-lg">
      <div>
        <label htmlFor="taskId" className="block text-sm font-medium text-gray-700">Task ID</label>
        <input
          id="taskId"
          name="taskId"
          placeholder="Task ID"
          onChange={handleChange}
          value={formData.taskId}
          required
          className="border mt-1 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label htmlFor="userId" className="block text-sm font-medium text-gray-700">User ID</label>
        <input
          id="userId"
          name="userId"
          placeholder="User ID"
          onChange={handleChange}
          value={formData.userId}
          required
          className="border mt-1 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          id="title"
          name="title"
          placeholder="Title"
          onChange={handleChange}
          value={formData.title}
          required
          className="border mt-1 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Description"
          onChange={handleChange}
          value={formData.description}
          className="border mt-1 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full px-4 py-2 rounded text-white font-medium ${
          loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Saving...' : 'Create Task'}
      </button>

      {message && <p className="text-sm mt-2 text-center">{message}</p>}
    </form>
  );
};

export default CreateTask;
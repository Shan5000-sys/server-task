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
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 shadow rounded">
      <input
        name="taskId"
        placeholder="Task ID"
        onChange={handleChange}
        value={formData.taskId}
        required
        className="border p-2 w-full"
      />
      <input
        name="userId"
        placeholder="User ID"
        onChange={handleChange}
        value={formData.userId}
        required
        className="border p-2 w-full"
      />
      <input
        name="title"
        placeholder="Title"
        onChange={handleChange}
        value={formData.title}
        required
        className="border p-2 w-full"
      />
      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
        value={formData.description}
        className="border p-2 w-full"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Saving...' : 'Create Task'}
      </button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
};

export default CreateTask;
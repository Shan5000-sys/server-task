import React, { useEffect, useState } from 'react';
import { uploadImage } from '../utils/uploadImage';
import { processImage } from '../utils/processImage';

interface TaskDetailProps {
  taskId: string;
  userId: string;
}

const API_BASE = 'https://u4e7e45gee.execute-api.ca-central-1.amazonaws.com/prod';

const TaskDetail: React.FC<TaskDetailProps> = ({ taskId, userId }) => {
  const [task, setTask] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/tasks`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((t: any) => t.taskId === taskId && t.userId === userId);
        setTask(found);
      });
  }, [taskId, userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });

      if (!res.ok) throw new Error('Failed to update task');
      const updatedTask = await res.json();

      if (selectedFile && updatedTask.imageUploadUrl) {
        await uploadImage(updatedTask.imageUploadUrl, selectedFile);
        try {
          const result = await processImage(updatedTask.taskId);
          setLabels(result.labels.map((label: any) => label.Name));
        } catch (err) {
          console.error('Error processing image:', err);
        }
      }

      setTask(updatedTask);
      setMessage('✅ Task updated successfully!');
      setEditing(false);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!task) return <p className="text-gray-500">Loading task...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700">Task ID:</label>
        <p className="text-gray-800">{task.taskId}</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">User ID:</label>
        <p className="text-gray-800">{task.userId}</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">Title:</label>
        {editing ? (
          <input
            name="title"
            value={task.title}
            onChange={handleChange}
            className="mt-1 border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        ) : (
          <p className="text-gray-800">{task.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">Description:</label>
        {editing ? (
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            className="mt-1 border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        ) : (
          <p className="text-gray-800">{task.description}</p>
        )}
      </div>

      {editing && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block"
          />
          {previewUrl && (
            <img src={previewUrl} alt="Preview" className="w-48 h-auto rounded border" />
          )}
        </div>
      )}

      <div className="pt-4">
        {editing ? (
          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full px-4 py-2 text-white font-medium rounded ${
              saving ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="w-full px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black font-medium rounded"
          >
            Edit
          </button>
        )}
      </div>

      {message && <p className="text-center text-sm mt-2">{message}</p>}

      {labels.length > 0 && (
        <div className="pt-4">
          <h3 className="text-sm font-semibold text-gray-700">Detected Labels:</h3>
          <ul className="list-disc list-inside text-gray-700 text-sm">
            {labels.map(label => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
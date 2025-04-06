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
      // Update the task
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });

      if (!res.ok) throw new Error('Failed to update task');
      const updatedTask = await res.json();

      // If file selected and pre-signed URL exists
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

  if (!task) return <p>Loading task...</p>;

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <div>
        <label className="font-semibold">Task ID:</label>
        <p>{task.taskId}</p>
      </div>

      <div>
        <label className="font-semibold">User ID:</label>
        <p>{task.userId}</p>
      </div>

      <div>
        <label className="font-semibold">Title:</label>
        {editing ? (
          <input
            name="title"
            value={task.title}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        ) : (
          <p>{task.title}</p>
        )}
      </div>

      <div>
        <label className="font-semibold">Description:</label>
        {editing ? (
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        ) : (
          <p>{task.description}</p>
        )}
      </div>

      {editing && (
        <div className="space-y-2">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {previewUrl && <img src={previewUrl} alt="Preview" className="w-48 rounded" />}
        </div>
      )}

      {editing ? (
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded">
          {saving ? 'Saving...' : 'Save'}
        </button>
      ) : (
        <button onClick={() => setEditing(true)} className="bg-gray-300 text-black px-4 py-2 rounded">
          Edit
        </button>
      )}

      {message && <p className="text-sm mt-2">{message}</p>}

      {labels.length > 0 && (
        <div>
          <h3 className="font-semibold mt-4">Detected Labels:</h3>
          <ul className="list-disc ml-6 text-sm">
            {labels.map(label => <li key={label}>{label}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
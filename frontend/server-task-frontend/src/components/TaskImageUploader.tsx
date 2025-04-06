import React, { useState } from 'react';

const TaskImageUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setLabels([]);
      setMessage(null);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return;

    try {
      // Get pre-signed URL
      const res = await fetch('https://u4e7e45gee.execute-api.ca-central-1.amazonaws.com/prod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: selectedFile.name, fileType: selectedFile.type }),
      });
      const { uploadUrl, key } = await res.json();

      // Upload to S3
      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': selectedFile.type },
        body: selectedFile,
      });

      // Analyze image
      const rekRes = await fetch('https://your-api-id.execute-api.ca-central-1.amazonaws.com/prod/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ s3Key: key }),
      });

      const data = await rekRes.json();
      setLabels(data.labels.map((label: any) => label.Name));
      setMessage('✅ Image analyzed successfully!');
    } catch (err: any) {
      console.error(err);
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-4 mt-6">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" className="w-48 rounded shadow" />}
      <button onClick={uploadImage} disabled={!selectedFile} className="bg-green-600 text-white px-4 py-2 rounded">
        Upload & Analyze
      </button>
      {message && <p className="text-sm">{message}</p>}
      {labels.length > 0 && (
        <ul className="list-disc ml-6 text-sm">
          {labels.map(label => <li key={label}>{label}</li>)}
        </ul>
      )}
    </div>
  );
};

export default TaskImageUploader;
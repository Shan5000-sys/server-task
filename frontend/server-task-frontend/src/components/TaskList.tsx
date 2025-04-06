import React, { useEffect, useState } from 'react';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://u4e7e45gee.execute-api.ca-central-1.amazonaws.com/prod')
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(err => console.error('Error fetching tasks:', err));
  }, []);

  if (loading) return <p>Loading tasks...</p>;

  return (
    <ul className="space-y-4">
      {tasks.map(task => (
        <li key={task.taskId} className="border p-4 rounded shadow">
          <h3 className="font-semibold">{task.title}</h3>
          <p>{task.description}</p>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
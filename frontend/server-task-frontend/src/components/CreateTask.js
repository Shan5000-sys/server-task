"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CreateTask = () => {
    const [formData, setFormData] = (0, react_1.useState)({
        taskId: '',
        userId: '',
        title: '',
        description: ''
    });
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [message, setMessage] = (0, react_1.useState)(null);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const res = await fetch('https://u4e7e45gee.execute-api.ca-central-1.amazonaws.com/prod/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!res.ok)
                throw new Error('Failed to create task');
            setMessage('✅ Task created!');
            setFormData({ taskId: '', userId: '', title: '', description: '' });
        }
        catch (err) {
            setMessage(`❌ ${err.message}`);
        }
        finally {
            setLoading(false);
        }
    };
    return (<form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow-md rounded-lg">
      <div>
        <label htmlFor="taskId" className="block text-sm font-medium text-gray-700">Task ID</label>
        <input id="taskId" name="taskId" placeholder="Task ID" onChange={handleChange} value={formData.taskId} required className="border mt-1 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
      </div>

      <div>
        <label htmlFor="userId" className="block text-sm font-medium text-gray-700">User ID</label>
        <input id="userId" name="userId" placeholder="User ID" onChange={handleChange} value={formData.userId} required className="border mt-1 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input id="title" name="title" placeholder="Title" onChange={handleChange} value={formData.title} required className="border mt-1 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="description" name="description" placeholder="Description" onChange={handleChange} value={formData.description} className="border mt-1 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"/>
      </div>

      <button type="submit" disabled={loading} className={`w-full px-4 py-2 rounded text-white font-medium ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
        {loading ? 'Saving...' : 'Create Task'}
      </button>

      {message && <p className="text-sm mt-2 text-center">{message}</p>}
    </form>);
};
exports.default = CreateTask;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3JlYXRlVGFzay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNyZWF0ZVRhc2sudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQXdDO0FBRXhDLE1BQU0sVUFBVSxHQUFhLEdBQUcsRUFBRTtJQUNoQyxNQUFNLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQztRQUN2QyxNQUFNLEVBQUUsRUFBRTtRQUNWLE1BQU0sRUFBRSxFQUFFO1FBQ1YsS0FBSyxFQUFFLEVBQUU7UUFDVCxXQUFXLEVBQUUsRUFBRTtLQUNoQixDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxLQUFLLENBQUMsQ0FBQztJQUM5QyxNQUFNLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBZ0IsSUFBSSxDQUFDLENBQUM7SUFFNUQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUE0RCxFQUFFLEVBQUU7UUFDcEYsV0FBVyxDQUFDLEVBQUUsR0FBRyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUNoRSxDQUFDLENBQUM7SUFFRixNQUFNLFlBQVksR0FBRyxLQUFLLEVBQUUsQ0FBa0IsRUFBRSxFQUFFO1FBQ2hELENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNuQixVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakIsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWpCLElBQUk7WUFDRixNQUFNLEdBQUcsR0FBRyxNQUFNLEtBQUssQ0FBQyxzRUFBc0UsRUFBRTtnQkFDOUYsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsT0FBTyxFQUFFLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixFQUFFO2dCQUMvQyxJQUFJLEVBQUUs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QUFDLG1EQUNULE9BQU8sQ0FBQyxDQUFDLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxDQUFDLCtCQUMvQyxFQUFFLENBQUMsQ0FFSDtRQUFBLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FDeEM7TUFBQSxFQUFFLE1BQU0sQ0FFUjs7TUFBQSxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDbkU7SUFBQSxFQUFFLElBQUksQ0FBQyxDQUNSLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRixrQkFBZSxVQUFVLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IENyZWF0ZVRhc2s6IFJlYWN0LkZDID0gKCkgPT4ge1xuICBjb25zdCBbZm9ybURhdGEsIHNldEZvcm1EYXRhXSA9IHVzZVN0YXRlKHtcbiAgICB0YXNrSWQ6ICcnLFxuICAgIHVzZXJJZDogJycsXG4gICAgdGl0bGU6ICcnLFxuICAgIGRlc2NyaXB0aW9uOiAnJ1xuICB9KTtcblxuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFttZXNzYWdlLCBzZXRNZXNzYWdlXSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpO1xuXG4gIGNvbnN0IGhhbmRsZUNoYW5nZSA9IChlOiBSZWFjdC5DaGFuZ2VFdmVudDxIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudD4pID0+IHtcbiAgICBzZXRGb3JtRGF0YSh7IC4uLmZvcm1EYXRhLCBbZS50YXJnZXQubmFtZV06IGUudGFyZ2V0LnZhbHVlIH0pO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZVN1Ym1pdCA9IGFzeW5jIChlOiBSZWFjdC5Gb3JtRXZlbnQpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgc2V0TG9hZGluZyh0cnVlKTtcbiAgICBzZXRNZXNzYWdlKG51bGwpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCdodHRwczovL3U0ZTdlNDVnZWUuZXhlY3V0ZS1hcGkuY2EtY2VudHJhbC0xLmFtYXpvbmF3cy5jb20vcHJvZC90YXNrcycsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShmb3JtRGF0YSlcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIXJlcy5vaykgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIHRhc2snKTtcbiAgICAgIHNldE1lc3NhZ2UoJ+KchSBUYXNrIGNyZWF0ZWQhJyk7XG4gICAgICBzZXRGb3JtRGF0YSh7IHRhc2tJZDogJycsIHVzZXJJZDogJycsIHRpdGxlOiAnJywgZGVzY3JpcHRpb246ICcnIH0pO1xuICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICBzZXRNZXNzYWdlKGDinYwgJHtlcnIubWVzc2FnZX1gKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGZvcm0gb25TdWJtaXQ9e2hhbmRsZVN1Ym1pdH0gY2xhc3NOYW1lPVwic3BhY2UteS00IGJnLXdoaXRlIHAtNiBzaGFkb3ctbWQgcm91bmRlZC1sZ1wiPlxuICAgICAgPGRpdj5cbiAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJ0YXNrSWRcIiBjbGFzc05hbWU9XCJibG9jayB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS03MDBcIj5UYXNrIElEPC9sYWJlbD5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgaWQ9XCJ0YXNrSWRcIlxuICAgICAgICAgIG5hbWU9XCJ0YXNrSWRcIlxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiVGFzayBJRFwiXG4gICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEudGFza0lkfVxuICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgY2xhc3NOYW1lPVwiYm9yZGVyIG10LTEgcC0yIHctZnVsbCByb3VuZGVkIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1ibHVlLTQwMFwiXG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdj5cbiAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJ1c2VySWRcIiBjbGFzc05hbWU9XCJibG9jayB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS03MDBcIj5Vc2VyIElEPC9sYWJlbD5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgaWQ9XCJ1c2VySWRcIlxuICAgICAgICAgIG5hbWU9XCJ1c2VySWRcIlxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiVXNlciBJRFwiXG4gICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEudXNlcklkfVxuICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgY2xhc3NOYW1lPVwiYm9yZGVyIG10LTEgcC0yIHctZnVsbCByb3VuZGVkIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1ibHVlLTQwMFwiXG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdj5cbiAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJ0aXRsZVwiIGNsYXNzTmFtZT1cImJsb2NrIHRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTcwMFwiPlRpdGxlPC9sYWJlbD5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgaWQ9XCJ0aXRsZVwiXG4gICAgICAgICAgbmFtZT1cInRpdGxlXCJcbiAgICAgICAgICBwbGFjZWhvbGRlcj1cIlRpdGxlXCJcbiAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS50aXRsZX1cbiAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgIGNsYXNzTmFtZT1cImJvcmRlciBtdC0xIHAtMiB3LWZ1bGwgcm91bmRlZCBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6cmluZy0yIGZvY3VzOnJpbmctYmx1ZS00MDBcIlxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwiZGVzY3JpcHRpb25cIiBjbGFzc05hbWU9XCJibG9jayB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS03MDBcIj5EZXNjcmlwdGlvbjwvbGFiZWw+XG4gICAgICAgIDx0ZXh0YXJlYVxuICAgICAgICAgIGlkPVwiZGVzY3JpcHRpb25cIlxuICAgICAgICAgIG5hbWU9XCJkZXNjcmlwdGlvblwiXG4gICAgICAgICAgcGxhY2Vob2xkZXI9XCJEZXNjcmlwdGlvblwiXG4gICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgICB2YWx1ZT17Zm9ybURhdGEuZGVzY3JpcHRpb259XG4gICAgICAgICAgY2xhc3NOYW1lPVwiYm9yZGVyIG10LTEgcC0yIHctZnVsbCByb3VuZGVkIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1ibHVlLTQwMFwiXG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGJ1dHRvblxuICAgICAgICB0eXBlPVwic3VibWl0XCJcbiAgICAgICAgZGlzYWJsZWQ9e2xvYWRpbmd9XG4gICAgICAgIGNsYXNzTmFtZT17YHctZnVsbCBweC00IHB5LTIgcm91bmRlZCB0ZXh0LXdoaXRlIGZvbnQtbWVkaXVtICR7XG4gICAgICAgICAgbG9hZGluZyA/ICdiZy1ibHVlLTMwMCBjdXJzb3Itbm90LWFsbG93ZWQnIDogJ2JnLWJsdWUtNjAwIGhvdmVyOmJnLWJsdWUtNzAwJ1xuICAgICAgICB9YH1cbiAgICAgID5cbiAgICAgICAge2xvYWRpbmcgPyAnU2F2aW5nLi4uJyA6ICdDcmVhdGUgVGFzayd9XG4gICAgICA8L2J1dHRvbj5cblxuICAgICAge21lc3NhZ2UgJiYgPHAgY2xhc3NOYW1lPVwidGV4dC1zbSBtdC0yIHRleHQtY2VudGVyXCI+e21lc3NhZ2V9PC9wPn1cbiAgICA8L2Zvcm0+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDcmVhdGVUYXNrOyJdfQ==
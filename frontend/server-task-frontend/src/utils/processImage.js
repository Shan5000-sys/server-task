"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processImage = void 0;
const processImage = async (taskId) => {
    const response = await fetch(`https://u4e7e45gee.execute-api.ca-central-1.amazonaws.com/prod/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ taskId })
    });
    if (!response.ok) {
        throw new Error(`Image processing failed with status: ${response.status}`);
    }
    return await response.json();
};
exports.processImage = processImage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY2Vzc0ltYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHJvY2Vzc0ltYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFPLE1BQU0sWUFBWSxHQUFHLEtBQUssRUFBRSxNQUFjLEVBQUUsRUFBRTtJQUNqRCxNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyx3RUFBd0UsRUFBRTtRQUNyRyxNQUFNLEVBQUUsTUFBTTtRQUNkLE9BQU8sRUFBRTtZQUNQLGNBQWMsRUFBRSxrQkFBa0I7U0FDbkM7UUFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDO0tBQ2pDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFO1FBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0NBQXdDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0tBQzVFO0lBRUQsT0FBTyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMvQixDQUFDLENBQUM7QUFkUyxRQUFBLFlBQVksZ0JBY3JCIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IHByb2Nlc3NJbWFnZSA9IGFzeW5jICh0YXNrSWQ6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vdTRlN2U0NWdlZS5leGVjdXRlLWFwaS5jYS1jZW50cmFsLTEuYW1hem9uYXdzLmNvbS9wcm9kL2FuYWx5emVgLCB7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdGFza0lkIH0pXG4gICAgfSk7XG4gIFxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW1hZ2UgcHJvY2Vzc2luZyBmYWlsZWQgd2l0aCBzdGF0dXM6ICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICAgIH1cbiAgXG4gICAgcmV0dXJuIGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgfTsiXX0=
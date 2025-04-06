"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AppHeader_1 = require("./components/AppHeader");
const CreateTask_1 = require("./components/CreateTask");
const TaskList_1 = require("./components/TaskList");
const TaskImageUploader_1 = require("./components/TaskImageUploader");
function App() {
    return (<div className="min-h-screen bg-gray-50">
      <AppHeader_1.default />
      <main className="p-6 max-w-2xl mx-auto space-y-10">
        <CreateTask_1.default />
        <TaskList_1.default />
        <TaskImageUploader_1.default />
      </main>
    </div>);
}
exports.default = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQXBwLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUEwQjtBQUMxQixzREFBK0M7QUFDL0Msd0RBQWlEO0FBQ2pELG9EQUE2QztBQUM3QyxzRUFBK0Q7QUFFL0QsU0FBUyxHQUFHO0lBQ1YsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsQ0FDdEM7TUFBQSxDQUFDLG1CQUFTLENBQUMsQUFBRCxFQUNWO01BQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGtDQUFrQyxDQUNoRDtRQUFBLENBQUMsb0JBQVUsQ0FBQyxBQUFELEVBQ1g7UUFBQSxDQUFDLGtCQUFRLENBQUMsQUFBRCxFQUNUO1FBQUEsQ0FBQywyQkFBaUIsQ0FBQyxBQUFELEVBQ3BCO01BQUEsRUFBRSxJQUFJLENBQ1I7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUM7QUFDSixDQUFDO0FBRUQsa0JBQWUsR0FBRyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBBcHBIZWFkZXIgZnJvbSAnLi9jb21wb25lbnRzL0FwcEhlYWRlcic7XG5pbXBvcnQgQ3JlYXRlVGFzayBmcm9tICcuL2NvbXBvbmVudHMvQ3JlYXRlVGFzayc7XG5pbXBvcnQgVGFza0xpc3QgZnJvbSAnLi9jb21wb25lbnRzL1Rhc2tMaXN0JztcbmltcG9ydCBUYXNrSW1hZ2VVcGxvYWRlciBmcm9tICcuL2NvbXBvbmVudHMvVGFza0ltYWdlVXBsb2FkZXInO1xuXG5mdW5jdGlvbiBBcHAoKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gYmctZ3JheS01MFwiPlxuICAgICAgPEFwcEhlYWRlciAvPlxuICAgICAgPG1haW4gY2xhc3NOYW1lPVwicC02IG1heC13LTJ4bCBteC1hdXRvIHNwYWNlLXktMTBcIj5cbiAgICAgICAgPENyZWF0ZVRhc2sgLz5cbiAgICAgICAgPFRhc2tMaXN0IC8+XG4gICAgICAgIDxUYXNrSW1hZ2VVcGxvYWRlciAvPlxuICAgICAgPC9tYWluPlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBBcHA7XG4iXX0=
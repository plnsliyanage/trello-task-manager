"use client";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import api from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

const COLUMNS = ["To Do", "Doing", "Done"];

export default function KanbanBoard({ refreshTrigger }) {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
    if (user?.role === "admin") {
      api
        .get("/auth/users")
        .then((res) => setUsers(res.data))
        .catch(() => {});
    }
  }, [refreshTrigger, user]);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId;

    setTasks((prev) =>
      prev.map((t) =>
        t._id === draggableId ? { ...t, status: newStatus } : t,
      ),
    );

    try {
      await api.patch(`/tasks/${draggableId}`, { status: newStatus });
    } catch (error) {
      console.error("Failed to update task status:", error);
      fetchTasks();
    }
  };

  const handleAssignChange = async (taskId, newAssigneeId) => {
    const targetId = newAssigneeId === "" ? null : newAssigneeId;
    try {
      const res = await api.patch(`/tasks/${taskId}`, {
        assignedUser: targetId,
      });
      setTasks((prev) => prev.map((t) => (t._id === taskId ? res.data : t)));
    } catch (error) {
      alert(error.response?.data?.error || "Failed to update task assignment");
      fetchTasks();
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {COLUMNS.map((column) => (
          <Droppable key={column} droppableId={column}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-100 p-4 rounded-lg shadow-inner min-h-[600px] flex flex-col"
              >
                <h2 className="font-bold text-lg mb-4 text-gray-700 flex justify-between items-center">
                  <span>{column}</span>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                    {tasks.filter((t) => t.status === column).length}
                  </span>
                </h2>
                <div className="flex-1 space-y-3">
                  {tasks
                    .filter((task) => task.status === column)
                    .map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-4 rounded shadow-sm border border-gray-200 space-y-2 hover:shadow-md transition-shadow"
                          >
                            <h3 className="font-semibold text-gray-900">
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-sm text-gray-600">
                                {task.description}
                              </p>
                            )}
                            <div className="pt-2 border-t border-gray-100 flex flex-col space-y-1 text-xs text-gray-500">
                              <div>
                                Creator:{" "}
                                <span className="font-medium text-gray-700">
                                  {task.creator?.username || "Unknown"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span>Assigned:</span>
                                {user?.role === "admin" ? (
                                  <select
                                    value={task.assignedUser?._id || ""}
                                    onChange={(e) =>
                                      handleAssignChange(
                                        task._id,
                                        e.target.value,
                                      )
                                    }
                                    className="border border-gray-300 rounded px-1 py-0.5 text-xs bg-white text-black"
                                  >
                                    <option value="">Unassigned</option>
                                    {users.map((u) => (
                                      <option key={u._id} value={u._id}>
                                        {u.username}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <span className="font-medium text-gray-700">
                                    {task.assignedUser?.username ||
                                      "Unassigned"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

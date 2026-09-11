"use client";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import api from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import {
  CircleDot,
  Clock,
  CheckCircle2,
  User,
  ShieldUser,
  GripVertical,
} from "lucide-react";

const COLUMNS = ["To Do", "Doing", "Done"];

const columnConfig = {
  "To Do": {
    icon: CircleDot,
    badgeColor: "bg-amber-500/10 text-amber-600 border-amber-200/60",
    headerBg: "border-amber-500/30",
    dotColor: "bg-amber-500",
  },
  Doing: {
    icon: Clock,
    badgeColor: "bg-indigo-500/10 text-indigo-600 border-indigo-200/60",
    headerBg: "border-indigo-500/30",
    dotColor: "bg-indigo-500",
  },
  Done: {
    icon: CheckCircle2,
    badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-200/60",
    headerBg: "border-emerald-500/30",
    dotColor: "bg-emerald-500",
  },
};

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-2 sm:p-4">
        {COLUMNS.map((column) => {
          const config = columnConfig[column];
          const ColumnIcon = config.icon;
          const count = tasks.filter((t) => t.status === column).length;

          return (
            <Droppable key={column} droppableId={column}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-col rounded-2xl bg-slate-100/70 backdrop-blur-sm border border-slate-200/80 p-4 transition-colors duration-200 min-h-[650px] shadow-sm ${
                    snapshot.isDraggingOver
                      ? "bg-indigo-50/40 border-indigo-200"
                      : ""
                  }`}
                >
                  {/* Column Header */}
                  <div
                    className={`flex items-center justify-between pb-3 mb-4 border-b ${config.headerBg}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${config.dotColor}`}
                      />
                      <h2 className="font-bold text-sm sm:text-base text-slate-800 tracking-tight flex items-center gap-2">
                        {column}
                      </h2>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${config.badgeColor}`}
                    >
                      {count}
                    </span>
                  </div>

                  {/* Tasks Container */}
                  <div className="flex-1 space-y-3.5">
                    {tasks
                      .filter((task) => task.status === column)
                      .map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`group relative bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 space-y-3 ${
                                snapshot.isDragging
                                  ? "shadow-2xl ring-2 ring-indigo-500/20 rotate-1 bg-white/95"
                                  : ""
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-slate-900 text-sm tracking-tight leading-snug">
                                  {task.title}
                                </h3>
                                <div className="text-slate-300 group-hover:text-slate-400 transition-colors shrink-0">
                                  <GripVertical className="h-4 w-4" />
                                </div>
                              </div>

                              {task.description && (
                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                  {task.description}
                                </p>
                              )}

                              <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2 text-xs text-slate-500">
                                <div className="flex items-center gap-1.5">
                                  <ShieldUser className="h-3.5 w-3.5 text-slate-400" />
                                  <span>Creator:</span>
                                  <span className="font-medium text-slate-700">
                                    {task.creator?.username || "Unknown"}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                  <div className="flex items-center gap-1.5">
                                    <User className="h-3.5 w-3.5 text-slate-400" />
                                    <span>Assigned:</span>
                                  </div>

                                  {user?.role === "admin" ? (
                                    <select
                                      value={task.assignedUser?._id || ""}
                                      onChange={(e) =>
                                        handleAssignChange(
                                          task._id,
                                          e.target.value,
                                        )
                                      }
                                      className="border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white rounded-lg px-2 py-1 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer shadow-inner"
                                    >
                                      <option value="">Unassigned</option>
                                      {users.map((u) => (
                                        <option key={u._id} value={u._id}>
                                          {u.username}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
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
          );
        })}
      </div>
    </DragDropContext>
  );
}

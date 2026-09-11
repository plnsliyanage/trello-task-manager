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
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    headerBg: "border-amber-200",
    dotColor: "bg-amber-500",
    iconColor: "text-amber-600",
    emptyText: "No tasks to do",
  },
  Doing: {
    icon: Clock,
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    headerBg: "border-indigo-200",
    dotColor: "bg-indigo-500",
    iconColor: "text-indigo-600",
    emptyText: "No tasks in progress",
  },
  Done: {
    icon: CheckCircle2,
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    headerBg: "border-emerald-200",
    dotColor: "bg-emerald-500",
    iconColor: "text-emerald-600",
    emptyText: "No completed tasks",
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
      <div className="w-full overflow-x-auto pb-4">
        <div className="grid min-w-[900px] grid-cols-3 gap-5 p-1 sm:gap-6 sm:p-2">
          {COLUMNS.map((column) => {
            const config = columnConfig[column];
            const ColumnIcon = config.icon;
            const columnTasks = tasks.filter((t) => t.status === column);
            const count = columnTasks.length;

            return (
              <Droppable key={column} droppableId={column}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex min-h-[520px] flex-col rounded-2xl border p-4 transition-all duration-200 sm:p-5 ${
                      snapshot.isDraggingOver
                        ? "border-indigo-300 bg-indigo-50/70 shadow-lg shadow-indigo-100"
                        : "border-slate-200 bg-slate-50/80"
                    }`}
                  >
                    {/* Column Header */}
                    <div
                      className={`mb-4 flex items-center justify-between border-b pb-4 ${config.headerBg}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-xl ${config.badgeColor}`}
                        >
                          <ColumnIcon
                            className={`h-4 w-4 ${config.iconColor}`}
                          />
                        </div>

                        <div>
                          <h2 className="text-sm font-bold text-slate-800 sm:text-base">
                            {column}
                          </h2>

                          <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                            {count === 1 ? "1 task" : `${count} tasks`}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`flex h-7 min-w-7 items-center justify-center rounded-full border px-2 text-xs font-bold ${config.badgeColor}`}
                      >
                        {count}
                      </span>
                    </div>

                    {/* Tasks */}
                    <div className="flex flex-1 flex-col gap-3">
                      {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/40 px-4 py-10 text-center">
                          <div
                            className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${config.badgeColor}`}
                          >
                            <ColumnIcon className="h-5 w-5" />
                          </div>

                          <p className="text-xs font-medium text-slate-400">
                            {config.emptyText}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-300">
                            Drag a task here
                          </p>
                        </div>
                      )}

                      {columnTasks.map((task, index) => (
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
                              className={`group relative rounded-2xl border bg-white p-4 transition-all duration-200 ${
                                snapshot.isDragging
                                  ? "rotate-1 border-indigo-300 shadow-2xl shadow-indigo-200/50 ring-2 ring-indigo-500/20"
                                  : "border-slate-200 shadow-sm hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/60"
                              }`}
                            >
                              {/* Drag Indicator */}
                              <div className="absolute right-3 top-3">
                                <div className="rounded-lg p-1 text-slate-300 transition-colors group-hover:bg-slate-100 group-hover:text-slate-400">
                                  <GripVertical className="h-4 w-4" />
                                </div>
                              </div>

                              {/* Task Title */}
                              <div className="pr-7">
                                <h3 className="text-sm font-bold leading-snug tracking-tight text-slate-900">
                                  {task.title}
                                </h3>
                              </div>

                              {/* Description */}
                              {task.description && (
                                <p className="mt-2.5 line-clamp-2 text-xs leading-5 text-slate-500">
                                  {task.description}
                                </p>
                              )}

                              {/* Task Details */}
                              <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-3">
                                {/* Creator */}
                                <div className="flex items-center gap-2">
                                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                                    <ShieldUser className="h-3.5 w-3.5 text-slate-500" />
                                  </div>

                                  <div className="min-w-0">
                                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                      Creator
                                    </p>

                                    <p className="truncate text-xs font-semibold text-slate-700">
                                      {task.creator?.username || "Unknown"}
                                    </p>
                                  </div>
                                </div>

                                {/* Assigned User */}
                                <div className="flex items-center gap-2">
                                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                                    <User className="h-3.5 w-3.5 text-indigo-500" />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                      Assigned
                                    </p>

                                    {user?.role === "admin" ? (
                                      <select
                                        value={task.assignedUser?._id || ""}
                                        onChange={(e) =>
                                          handleAssignChange(
                                            task._id,
                                            e.target.value,
                                          )
                                        }
                                        className="mt-0.5 max-w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-semibold text-slate-700 outline-none transition-all hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
                                      >
                                        <option value="">Unassigned</option>

                                        {users.map((u) => (
                                          <option key={u._id} value={u._id}>
                                            {u.username}
                                          </option>
                                        ))}
                                      </select>
                                    ) : (
                                      <p className="mt-0.5 truncate text-xs font-semibold text-slate-700">
                                        {task.assignedUser?.username ||
                                          "Unassigned"}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Status Indicator */}
                              <div className="mt-4 flex items-center justify-between">
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${config.badgeColor}`}
                                >
                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${config.dotColor}`}
                                  />
                                  {column}
                                </span>
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
      </div>
    </DragDropContext>
  );
}

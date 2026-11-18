"use client";
import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type Task = {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  category: "study" | "assignment" | "exam" | "career" | "other";
  due_date?: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "Read Chapter 4 on Attention Mechanisms",
      description: "Focus on Query, Key, Value tensor matrix math",
      is_completed: true,
      priority: "high",
      category: "study",
      due_date: "Today",
    },
    {
      id: "task-2",
      title: "Complete CS302 Assignment 3 (PyTorch Implementation)",
      description: "Implement CNN with residual connections on CIFAR-10",
      is_completed: false,
      priority: "urgent",
      category: "assignment",
      due_date: "Tomorrow, 11:59 PM",
    },
    {
      id: "task-3",
      title: "Review Flashcards on Distributed System CAP Theorem",
      description: "10 minutes spaced repetition",
      is_completed: false,
      priority: "medium",
      category: "study",
      due_date: "Nov 20",
    },
    {
      id: "task-4",
      title: "Update Resume with Cortexa AI Project Achievements",
      description: "Include metrics: reduced latency, dual-provider fallback",
      is_completed: false,
      priority: "high",
      category: "career",
      due_date: "Nov 22",
    },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<Task["priority"]>("medium");
  const [newCategory, setNewCategory] = useState<Task["category"]>("study");
  const [newDueDate, setNewDueDate] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const handleAddTask = () => {
    if (!newTitle.trim()) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      is_completed: false,
      priority: newPriority,
      category: newCategory,
      due_date: newDueDate || "Upcoming",
    };
    setTasks([newTask, ...tasks]);
    setNewTitle("");
    setNewDueDate("");
  };

  const toggleTask = (taskId: string) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, is_completed: !t.is_completed } : t
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.is_completed;
    if (filter === "pending") return !t.is_completed;
    if (filter !== "all") return t.category === filter;
    return true;
  });

  const completedCount = tasks.filter((t) => t.is_completed).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#F0F0FF" }}>
            ✅ Productivity & Study Planner
          </h1>
          <p className="text-sm mt-1" style={{ color: "#64748B" }}>
            Organize coursework, study milestones, and career deadlines with zero clutter.
          </p>
        </div>
        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <span className="text-sm">🎯</span>
          <span className="text-xs font-bold text-white">
            {completedCount} / {tasks.length} Completed
          </span>
        </div>
      </div>

      {/* Add Task Card */}
      <div className="glass-card p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
          Add New Study / Career Task
        </h3>
        <div className="grid md:grid-cols-4 gap-3 mb-3">
          <div className="md:col-span-2">
            <input
              className="input-glass"
              placeholder="What do you need to study or complete?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTask();
              }}
            />
          </div>
          <div>
            <select
              className="input-glass"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as any)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <select
              className="input-glass"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
            >
              <option value="study">Study</option>
              <option value="assignment">Assignment</option>
              <option value="exam">Exam Prep</option>
              <option value="career">Career</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="btn-primary text-xs py-2 px-5"
            onClick={handleAddTask}
            disabled={!newTitle.trim()}
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        {["all", "pending", "completed", "study", "assignment", "career"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all ${
              filter === f
                ? "bg-violet-600 text-white"
                : "glass-card text-gray-400 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="glass-card divide-y divide-white/5 overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-xs" style={{ color: "#64748B" }}>
            No tasks found in this view. Keep up the great work!
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 flex items-center justify-between gap-4 transition-all hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={task.is_completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-5 h-5 rounded accent-violet-500 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-semibold truncate ${
                      task.is_completed ? "line-through text-gray-500" : "text-white"
                    }`}
                  >
                    {task.title}
                  </div>
                  {task.description && (
                    <div className="text-xs text-gray-400 mt-0.5 truncate">
                      {task.description}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span
                  className={`badge ${
                    task.priority === "urgent"
                      ? "badge-red"
                      : task.priority === "high"
                      ? "badge-amber"
                      : "badge-violet"
                  } text-[10px] uppercase`}
                >
                  {task.priority}
                </span>
                <span className="text-xs text-gray-500 hidden sm:inline">
                  {task.due_date}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-gray-500 hover:text-red-400 text-sm px-2"
                  title="Delete Task"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { MOCK_TASKS, MOCK_USERS } from '../constants';
import type { Task, TaskPriority, TaskStatus } from '../types';

export interface NewTaskData {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate: string;
  relatedTo?: {
    type: 'Lead' | 'Contact' | 'Deal';
    id: string;
    name: string;
  };
}

interface TasksContextType {
  tasks: Task[];
  addTask: (taskData: NewTaskData & { assignedToId?: string }) => void;
  editTask: (taskId: string, taskData: Partial<Task>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  const addTask = (taskData: NewTaskData & { assignedToId?: string }) => {
    const currentUser = MOCK_USERS.user_1; // Default user if none assigned
    const newTask: Task = {
        id: `task_${Date.now()}`,
        title: taskData.title,
        description: taskData.description,
        status: 'Pending',
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        assignedToId: taskData.assignedToId || currentUser.id,
        relatedTo: taskData.relatedTo,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  const editTask = (taskId: string, taskData: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, ...taskData, updatedAt: new Date().toISOString() } : task
      )
    );
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status, updatedAt: new Date().toISOString() } : task
      )
    );
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, editTask, updateTaskStatus }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};
import React, { useState, useMemo } from 'react';
import { Plus, CheckSquare, ArrowUp, ArrowDown, Minus, ChevronsUpDown, ChevronUp, ChevronDown, Edit3 } from 'lucide-react';
import { useTasks } from '../../contexts/TasksContext';
import { useUsers } from '../../contexts/UsersContext';
import { useUI } from '../../contexts/UIContext';
import type { Task, TaskStatus, TaskPriority } from '../../types';
import EditTaskModal from './components/EditTaskModal';

const statusColors: Record<TaskStatus, string> = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Completed': 'bg-green-100 text-green-800',
};

const priorityConfig: Record<TaskPriority, { color: string; icon: React.ElementType }> = {
  'High': { color: 'text-red-600', icon: ArrowUp },
  'Medium': { color: 'text-yellow-600', icon: Minus },
  'Low': { color: 'text-gray-600', icon: ArrowDown },
};


const TasksPage: React.FC = () => {
  const { tasks } = useTasks();
  const { users } = useUsers();
  const { openCreateTaskModal, openEditTaskModal } = useUI();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'All'>('All');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const getAssignee = (userId: string) => {
    return users[userId] || { name: 'Unassigned', avatar: '' };
  }

  const filteredTasks = useMemo(() => {
    if (statusFilter === 'All') {
      return tasks;
    }
    return tasks.filter(task => task.status === statusFilter);
  }, [tasks, statusFilter]);

  const sortedTasks = useMemo(() => {
    let sortableItems = [...filteredTasks];
    if (sortConfig !== null) {
        sortableItems.sort((a, b) => {
            let aValue, bValue;
            if (sortConfig.key === 'priority') {
                const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
                aValue = priorityOrder[a.priority];
                bValue = priorityOrder[b.priority];
            } else if (sortConfig.key === 'assignedToId') {
                aValue = getAssignee(a.assignedToId).name;
                bValue = getAssignee(b.assignedToId).name;
            } else if (sortConfig.key === 'relatedTo') {
                aValue = a.relatedTo?.name || '';
                bValue = b.relatedTo?.name || '';
            } else {
                aValue = a[sortConfig.key as keyof Task];
                bValue = b[sortConfig.key as keyof Task];
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }
    return sortableItems;
  }, [filteredTasks, sortConfig, users]);

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ChevronsUpDown className="w-4 h-4 ml-1 opacity-40" />;
    }
    return sortConfig.direction === 'ascending' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />;
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    openEditTaskModal();
  };

  const taskStatuses: (TaskStatus | 'All')[] = ['All', 'Pending', 'In Progress', 'Completed'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-main flex items-center gap-2">
            <CheckSquare className="w-8 h-8" />
            Tasks
          </h1>
          <p className="text-text-light mt-1">Manage your to-do list and track your progress.</p>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button onClick={openCreateTaskModal} className="bg-primary text-white px-3 sm:px-4 py-2 rounded-md text-sm font-semibold hover:bg-primary-dark flex items-center flex-grow sm:flex-grow-0">
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {taskStatuses.map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                statusFilter === status
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => requestSort('title')} className="flex items-center hover:text-gray-700">Title {getSortIcon('title')}</button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => requestSort('status')} className="flex items-center hover:text-gray-700">Status {getSortIcon('status')}</button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => requestSort('priority')} className="flex items-center hover:text-gray-700">Priority {getSortIcon('priority')}</button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => requestSort('dueDate')} className="flex items-center hover:text-gray-700">Due Date {getSortIcon('dueDate')}</button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => requestSort('assignedToId')} className="flex items-center hover:text-gray-700">Assigned To {getSortIcon('assignedToId')}</button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => requestSort('relatedTo')} className="flex items-center hover:text-gray-700">Related To {getSortIcon('relatedTo')}</button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedTasks.map((task: Task) => {
                const assignee = getAssignee(task.assignedToId);
                const priority = priorityConfig[task.priority];
                return (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[task.status]}`}>
                            {task.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center text-sm font-medium ${priority.color}`}>
                            <priority.icon className="w-4 h-4 mr-1" />
                            <span>{task.priority}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.dueDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <img className="h-8 w-8 rounded-full" src={assignee.avatar} alt={assignee.name} />
                            <div className="ml-3 text-sm text-gray-900">{assignee.name}</div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.relatedTo?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        onClick={() => handleEditTask(task)}
                        className="text-primary hover:text-primary-dark flex items-center"
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <EditTaskModal task={selectedTask} />
    </div>
  );
};

export default TasksPage;
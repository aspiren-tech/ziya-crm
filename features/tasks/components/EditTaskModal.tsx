import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useUI } from '../../../contexts/UIContext';
import { useTasks } from '../../../contexts/TasksContext';
import { useUsers } from '../../../contexts/UsersContext';
import { Task, TaskStatus, TaskPriority, User } from '../../../types';
import Button from '../../../components/shared/ui/Button';

interface EditTaskModalProps {
  task?: Task | null;
}

const statusOptions: TaskStatus[] = ['Pending', 'In Progress', 'Completed'];
const priorityOptions: TaskPriority[] = ['High', 'Medium', 'Low'];

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task }) => {
  const { isEditTaskModalOpen, closeEditTaskModal } = useUI();
  const { editTask, updateTaskStatus } = useTasks();
  const { users } = useUsers();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('Pending');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [assignedToId, setAssignedToId] = useState('');

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate);
      setAssignedToId(task.assignedToId);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) {
      alert('Please fill in Title and Due Date.');
      return;
    }
    
    if (task) {
      editTask(task.id, { 
        title, 
        description: description || undefined, 
        status, 
        priority, 
        dueDate, 
        assignedToId 
      });
    }
    
    // Close modal
    closeEditTaskModal();
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (task) {
      updateTaskStatus(task.id, newStatus);
      setStatus(newStatus);
    }
  };

  if (!isEditTaskModalOpen || !task) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-text-main">Edit Task</h2>
          <button 
            onClick={closeEditTaskModal} 
            className="p-1 hover:bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select 
                  value={status} 
                  onChange={e => handleStatusChange(e.target.value as TaskStatus)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                  {statusOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select 
                  value={priority} 
                  onChange={e => setPriority(e.target.value as TaskPriority)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                  {priorityOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date <span className="text-red-500">*</span></label>
              <input 
                type="date" 
                value={dueDate} 
                onChange={e => setDueDate(e.target.value)} 
                required 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Assigned To</label>
              <select 
                value={assignedToId} 
                onChange={e => setAssignedToId(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                {Object.values(users).map((user: User) => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="p-6 bg-gray-50 border-t flex justify-end items-center space-x-3 rounded-b-lg">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={closeEditTaskModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
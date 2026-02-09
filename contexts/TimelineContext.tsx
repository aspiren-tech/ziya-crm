import React, { createContext, useState, useContext, ReactNode } from 'react';
import { MOCK_NOTES, MOCK_ACTIVITIES, MOCK_USERS } from '../constants';
import type { Note, Activity } from '../types';

interface TimelineContextType {
  notes: Note[];
  activities: Activity[];
  addNote: (leadId: string, content: string) => void;
  logTaskCreation: (leadId: string, taskTitle: string, taskDetails: string) => void;
}

const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export const TimelineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);

  const addNote = (leadId: string, content: string) => {
    const currentUser = MOCK_USERS.user_1; // Assuming current user is user_1
    const newNote: Note = {
      id: `note_${Date.now()}`,
      leadId,
      content,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      createdAt: new Date().toISOString(),
    };
    setNotes(prevNotes => [newNote, ...prevNotes]);
  };

  const logTaskCreation = (leadId: string, taskTitle: string, taskDetails: string) => {
    const currentUser = MOCK_USERS.user_1;
    const newTaskActivity: Activity = {
      id: `activity_${Date.now()}`,
      leadId,
      type: 'Task',
      title: `Task Created: ${taskTitle}`,
      content: taskDetails,
      authorName: currentUser.name,
      createdAt: new Date().toISOString(),
    };
    setActivities(prevActivities => [newTaskActivity, ...prevActivities]);
  };

  return (
    <TimelineContext.Provider value={{ notes, activities, addNote, logTaskCreation }}>
      {children}
    </TimelineContext.Provider>
  );
};

export const useTimeline = () => {
  const context = useContext(TimelineContext);
  if (context === undefined) {
    throw new Error('useTimeline must be used within a TimelineProvider');
  }
  return context;
};
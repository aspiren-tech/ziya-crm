import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Notification } from '../types';
import { useInvoices } from './InvoicesContext';

interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  unreadCount: number;
  checkNotifications: () => void; // New function to manually trigger notification check
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// Mock notifications data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    type: 'invoice_overdue',
    title: 'Overdue Invoice',
    message: 'Invoice INV-003 for Peter Jones is 13 days overdue.',
    relatedEntityId: 'inv_3',
    relatedEntityType: 'invoice',
    isRead: false,
    createdAt: '2025-11-12T10:00:00Z',
  },
  {
    id: 'notif_2',
    type: 'invoice_due_soon',
    title: 'Invoice Due Soon',
    message: 'Invoice INV-002 for Jane Smith is due in 5 days.',
    relatedEntityId: 'inv_2',
    relatedEntityType: 'invoice',
    isRead: false,
    createdAt: '2025-11-15T14:30:00Z',
  },
  {
    id: 'notif_3',
    type: 'payment_received',
    title: 'Payment Received',
    message: 'Payment of $750 received for Invoice INV-001 from John Doe.',
    relatedEntityId: 'inv_1',
    relatedEntityType: 'invoice',
    isRead: true,
    createdAt: '2025-11-10T09:15:00Z',
    sentAt: '2025-11-10T09:20:00Z',
  },
];

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const { invoices } = useInvoices();

  // Calculate unread count
  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  // Add a new notification
  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notif_${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // Remove a notification
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Check for overdue invoices and create notifications
  const checkOverdueInvoices = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for comparison
    
    invoices.forEach(invoice => {
      // Only check for 'Due' or 'Overdue' invoices
      if (invoice.status !== 'Due' && invoice.status !== 'Overdue') {
        return;
      }
      
      const dueDate = new Date(invoice.dueDate);
      dueDate.setHours(0, 0, 0, 0); // Set to start of day for comparison
      
      // Check if invoice is overdue
      if (dueDate < today) {
        // Check if we already have an overdue notification for this invoice
        const existingNotification = notifications.find(
          n => n.relatedEntityId === invoice.id && n.type === 'invoice_overdue'
        );
        
        if (!existingNotification) {
          // Create overdue notification
          addNotification({
            type: 'invoice_overdue',
            title: 'Invoice Overdue',
            message: `Invoice ${invoice.invoiceNumber} for ${invoice.clientName} is overdue.`,
            relatedEntityId: invoice.id,
            relatedEntityType: 'invoice',
          });
        }
      }
      // Check if invoice is due soon (within 3 days)
      else if (dueDate <= new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)) {
        // Check if we already have a due soon notification for this invoice
        const existingNotification = notifications.find(
          n => n.relatedEntityId === invoice.id && n.type === 'invoice_due_soon'
        );
        
        if (!existingNotification) {
          const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          const daysText = daysUntilDue === 1 ? '1 day' : `${daysUntilDue} days`;
          
          // Create due soon notification
          addNotification({
            type: 'invoice_due_soon',
            title: 'Invoice Due Soon',
            message: `Invoice ${invoice.invoiceNumber} for ${invoice.clientName} is due in ${daysText}.`,
            relatedEntityId: invoice.id,
            relatedEntityType: 'invoice',
          });
        }
      }
    });
  };

  // Public function to manually trigger notification check
  const checkNotifications = () => {
    checkOverdueInvoices();
  };

  // Periodically check for overdue invoices
  useEffect(() => {
    // Check immediately on mount
    checkOverdueInvoices();
    
    // Check every 5 minutes
    const interval = setInterval(() => {
      checkOverdueInvoices();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [invoices]);

  return (
    <NotificationsContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      unreadCount,
      checkNotifications,
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
// Real-time notification service using Firestore
import { collection, addDoc, query, where, orderBy, onSnapshot, updateDoc, doc, Timestamp } from 'firebase/firestore'
import { db } from './firebase'

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'task_assigned' | 'task_updated' | 'task_completed' | 'task_deleted'
  taskId?: string
  read: boolean
  createdAt: string
  metadata?: {
    taskTitle?: string
    assignedBy?: string
    status?: string
    taskId?: string
  }
}

/**
 * Create a new notification
 */
export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: Notification['type'],
  metadata?: Notification['metadata']
): Promise<void> {
  try {
    await addDoc(collection(db, 'notifications'), {
      userId,
      title,
      message,
      type,
      metadata: metadata || {},
      read: false,
      createdAt: new Date().toISOString(),
    })
    console.log('✅ Notification created:', title)
  } catch (error) {
    console.error('❌ Error creating notification:', error)
  }
}

/**
 * Subscribe to user's notifications
 */
export function subscribeToNotifications(
  userId: string,
  callback: (notifications: Notification[]) => void
) {
  // Temporary: Remove orderBy to avoid composite index requirement
  // Once you create the index, you can add back: orderBy('createdAt', 'desc')
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId)
  )

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Notification[]
    
    // Sort client-side by createdAt descending
    notifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    callback(notifications)
  })
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'notifications', notificationId), {
      read: true,
    })
  } catch (error) {
    console.error('❌ Error marking notification as read:', error)
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(userId: string, notificationIds: string[]): Promise<void> {
  try {
    const promises = notificationIds.map((id) =>
      updateDoc(doc(db, 'notifications', id), { read: true })
    )
    await Promise.all(promises)
    console.log('✅ All notifications marked as read')
  } catch (error) {
    console.error('❌ Error marking all as read:', error)
  }
}

/**
 * Helper function to create task assignment notification
 */
export async function notifyTaskAssignment(
  userId: string,
  taskTitle: string,
  assignedBy: string,
  taskId: string
): Promise<void> {
  await createNotification(
    userId,
    '🎯 New Task Assigned',
    `${assignedBy} assigned you a task: "${taskTitle}"`,
    'task_assigned',
    { taskTitle, assignedBy, taskId }
  )
}

/**
 * Helper function to create task update notification
 */
export async function notifyTaskUpdate(
  userId: string,
  taskTitle: string,
  updatedBy: string,
  newStatus: string,
  taskId: string
): Promise<void> {
  await createNotification(
    userId,
    '📝 Task Updated',
    `${updatedBy} updated "${taskTitle}" to ${newStatus}`,
    'task_updated',
    { taskTitle, status: newStatus, taskId }
  )
}

/**
 * Helper function to create task completion notification
 */
export async function notifyTaskCompleted(
  userId: string,
  taskTitle: string,
  completedBy: string,
  taskId: string
): Promise<void> {
  await createNotification(
    userId,
    '✅ Task Completed',
    `${completedBy} completed the task: "${taskTitle}"`,
    'task_completed',
    { taskTitle, taskId }
  )
}

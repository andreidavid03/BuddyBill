export interface User {
  id: string;
  email: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  isPaid: boolean;
  groupId: string;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
}

export interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

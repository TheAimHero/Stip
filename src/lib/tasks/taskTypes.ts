export type ModTask = {
  group: {
    id: number;
    name: string;
    description: string;
  };
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  groupId: number;
  createdAt: Date;
  assignedById: string;
};

export type UserTask = {
  task: {
    id: number;
    groupId: number;
    description: string;
    title: string;
    dueDate: Date;
    createdAt: Date;
    assignedById: string;
    state: 'OPEN' | 'DELETED' | 'DONE';
    assignedBy: {
      id: string;
      name: string | null;
      email: string;
      emailVerified: Date | null;
      image: string | null;
      role: 'USER' | 'MOD' | 'ADMIN';
      groupId: number | null;
      rollNo: number | null;
    };
  };
  userId: string;
  taskId: number;
  completed: boolean;
  completedAt: Date | null;
  cancelled: boolean;
  cancelledAt: number | null;
};

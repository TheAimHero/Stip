export type ModTask = {
  group: {
    id: string;
    name: string;
  };
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  groupId: string;
  createdAt: Date;
  assignedById: string;
};

export type UserTask = {
  task: {
    id: number;
    groupId: number;
    description: string;
    state: 'OPEN' | 'DELETED' | 'DONE';
    title: string;
    dueDate: Date;
    createdAt: Date;
    assignedById: string;
    assignedBy: {
      id: string;
      name: string | null;
      email: string;
      emailVerified: Date | null;
      image: string | null;
      role: 'MOD' | 'USER' | 'ADMIN';
      groupId: number;
      rollNo: number | null;
    };
  };
  userId: string;
  taskId: number;
  completed: boolean;
  completedAt: Date | null;
  cancelled: boolean;
  cancelledAt: Date | null;
};

function isUserTask(taskArr: UserTask[] | ModTask[]): taskArr is UserTask[] {
  return taskArr.every((task) => {
    if (task.hasOwnProperty('userId')) return true;
    return false;
  });
}

class FilterTasks {
  taskArr: UserTask[] | ModTask[];

  constructor(taskArr: UserTask[] | ModTask[]) {
    this.taskArr = taskArr;
  }

  filterCompleted(): UserTask[] | ModTask[] {
    if (isUserTask(this.taskArr)) {
      return this.taskArr.filter((task) => task.completed === true);
    }
    return this.taskArr;
  }

  filterIncomplete(): UserTask[] | ModTask[] {
    if (isUserTask(this.taskArr)) {
      return this.taskArr.filter((task) => task.completed === false);
    }
    return this.taskArr;
  }

  filterCancelled(): UserTask[] | ModTask[] {
    if (isUserTask(this.taskArr)) {
      return this.taskArr.filter((task) => task.task.state === 'DELETED');
    }
    return this.taskArr;
  }

  filterNotCancelled(): UserTask[] | ModTask[] {
    if (isUserTask(this.taskArr)) {
      return this.taskArr.filter((task) => task.task.state === 'OPEN');
    }
    return this.taskArr;
  }

  filterByAll(): UserTask[] | ModTask[] {
    return this.taskArr;
  }

  filterByOverdue(): UserTask[] | ModTask[] {
    if (isUserTask(this.taskArr)) {
      return this.taskArr.filter((task) => task.task.dueDate < new Date());
    }
    return this.taskArr;
  }
}

export type filterTaskMethods =
  | 'filterCompleted'
  | 'filterIncomplete'
  | 'filterCancelled'
  | 'filterNotCancelled'
  | 'filterByOverdue'
  | 'filterByAll';

export default FilterTasks;

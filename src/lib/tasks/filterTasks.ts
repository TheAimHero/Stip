export type ModTask = {
  Group: {
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
  Task: {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    assignedById: string;
    groupId: string;
    createdAt: Date;
    state: string;
  };
  User: { id: string; name: string | null };
  completed: boolean;
  taskId: string;
  completedAt: Date | null;
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
      return this.taskArr.filter((task) => task.Task.state === 'DELETED');
    }
    return this.taskArr;
  }

  filterNotCancelled(): UserTask[] | ModTask[] {
    if (isUserTask(this.taskArr)) {
      return this.taskArr.filter((task) => task.Task.state === 'OPEN');
    }
    return this.taskArr;
  }

  filterByAll(): UserTask[] | ModTask[] {
    return this.taskArr;
  }

  filterByOverdue(): UserTask[] | ModTask[] {
    if (isUserTask(this.taskArr)) {
      return this.taskArr.filter((task) => task.Task.dueDate < new Date());
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

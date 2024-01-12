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

function isUserTask(taskArr: ModTask[] | UserTask[]): taskArr is UserTask[] {
  return taskArr.every((task) => (task as UserTask).User !== undefined);
}

class SortTasksClass {
  taskArr: ModTask[] | UserTask[];

  constructor(taskArr: ModTask[] | UserTask[]) {
    this.taskArr = taskArr;
  }

  sortByDueDate(sortParam: SortParam): UserTask[] | ModTask[] {
    if (isUserTask(this.taskArr)) {
      return this.taskArr.sort((a, b) => {
        if (sortParam === 'asc') {
          return (
            new Date(a.Task.dueDate).getTime() -
            new Date(b.Task.dueDate).getTime()
          );
        } else {
          return (
            new Date(b.Task.dueDate).getTime() -
            new Date(a.Task.dueDate).getTime()
          );
        }
      });
    } else {
      return this.taskArr.sort((a, b) => {
        if (sortParam === 'asc') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        } else {
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        }
      });
    }
  }

  sortByCreatedAt(sortParam: SortParam): UserTask[] | ModTask[] {
    if (isUserTask(this.taskArr)) {
      return this.taskArr.sort((a, b) => {
        if (sortParam === 'asc') {
          return (
            new Date(a.Task.createdAt).getTime() -
            new Date(b.Task.createdAt).getTime()
          );
        } else {
          return (
            new Date(b.Task.createdAt).getTime() -
            new Date(a.Task.createdAt).getTime()
          );
        }
      });
    } else {
      return this.taskArr.sort((a, b) => {
        if (sortParam === 'asc') {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        } else {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
      });
    }
  }

  sortByTitle(sortParam: SortParam): UserTask[] | ModTask[] {
    if (isUserTask(this.taskArr)) {
      return this.taskArr.sort((a, b) => {
        if (sortParam === 'asc') {
          return a.Task.title.localeCompare(b.Task.title);
        } else {
          return b.Task.title.localeCompare(a.Task.title);
        }
      });
    } else {
      return this.taskArr.sort((a, b) => {
        if (sortParam === 'asc') {
          return a.title.localeCompare(b.title);
        } else {
          return b.title.localeCompare(a.title);
        }
      });
    }
  }
}

export type SortTasksMethod =
  | 'sortByTitle'
  | 'sortByCreatedAt'
  | 'sortByDueDate';

export type SortParam = 'asc' | 'desc';

export default SortTasksClass;

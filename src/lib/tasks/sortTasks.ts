import { type ModTask, type UserTask } from './taskTypes';

function isUserTask(taskArr: ModTask[] | UserTask[]): taskArr is UserTask[] {
  return taskArr.every((task) => (task as UserTask).completed !== undefined);
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
            new Date(a.task.dueDate).getTime() -
            new Date(b.task.dueDate).getTime()
          );
        } else {
          return (
            new Date(b.task.dueDate).getTime() -
            new Date(a.task.dueDate).getTime()
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
            new Date(a.task.createdAt).getTime() -
            new Date(b.task.createdAt).getTime()
          );
        } else {
          return (
            new Date(b.task.createdAt).getTime() -
            new Date(a.task.createdAt).getTime()
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
          return a.task.title.localeCompare(b.task.title);
        } else {
          return b.task.title.localeCompare(a.task.title);
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

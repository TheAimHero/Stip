import { type ModTask, type UserTask } from './taskTypes';

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

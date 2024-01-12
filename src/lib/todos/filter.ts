import { type Todo } from '@prisma/client';

class Filter {
  todoArr: Todo[];

  constructor(todoArr: Todo[]) {
    this.todoArr = todoArr;
  }

  filterByCompleted() {
    return this.todoArr.filter((todo) => todo.completed);
  }

  filterByIncompleted() {
    return this.todoArr.filter((todo) => !todo.completed);
  }

  filterByOverdue() {
    const today = new Date();
    return this.todoArr.filter((todo) => {
      const dueDate = new Date(todo.dueDate);
      return dueDate < today;
    });
  }

  filterByAll() {
    return this.todoArr;
  }
}

export type filterMethodType =
  | 'filterByCompleted'
  | 'filterByIncompleted'
  | 'filterByOverdue'
  | 'filterByAll';

export default Filter;

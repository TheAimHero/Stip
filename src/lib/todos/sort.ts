import { type Todo } from '@prisma/client';

class Sort {
  todoArr: Todo[];

  constructor(todoArr: Todo[]) {
    this.todoArr = todoArr;
  }

  sortByDueDate(type: 'asc' | 'desc') {
    if (type === 'asc') {
      return this.todoArr.sort(
        (a, b) => a.dueDate.valueOf() - b.dueDate.valueOf(),
      );
    } else {
      return this.todoArr.sort(
        (a, b) => b.dueDate.valueOf() - a.dueDate.valueOf(),
      );
    }
  }

  sortByTitle(type: 'asc' | 'desc') {
    if (type === 'asc') {
      return this.todoArr.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      return this.todoArr.sort((a, b) => b.title.localeCompare(a.title));
    }
  }

  sortByCreatedAt(type: 'asc' | 'desc') {
    if (type === 'asc') {
      return this.todoArr.sort(
        (a, b) => a.createdAt.valueOf() - b.createdAt.valueOf(),
      );
    } else {
      return this.todoArr.sort(
        (a, b) => b.createdAt.valueOf() - a.createdAt.valueOf(),
      );
    }
  }
}

export type sortMethodType =
  | 'sortByTitle'
  | 'sortByDueDate'
  | 'sortByCreatedAt';

export type sortParamType = 'asc' | 'desc';

export default Sort;

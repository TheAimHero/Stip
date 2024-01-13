import React, { useState, type FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { api } from '@/trpc/react';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface TodoDialogProps {
  todoId: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}

const TodoDialog: FC<TodoDialogProps> = ({ todoId, isOpen, setIsOpen }) => {
  const { data: todo, status: todoStatus } = api.todo.getOne.useQuery(todoId,{
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const { mutate: updateTodo } = api.todo.update.useMutation({
    onSettled: () => {
      setIsEdited(false);
      setIsUpdating(false);
    },
    onError: () => {
      setIsEdited(true);
      setIsUpdating(false);
    },
  });
  const [isEdited, setIsEdited] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [note, setNote] = useState<string>('');
  function addNote() {
    isUpdating ? setIsUpdating(false) : setIsUpdating(true);
    updateTodo({ id: todoId, note });
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='max-h-[90%] max-w-[90%] overflow-scroll sm:max-h-full sm:max-w-[60%] sm:overflow-auto'>
        <DialogHeader>
          <DialogTitle>Todo Details</DialogTitle>
        </DialogHeader>
        {todoStatus === 'loading' && (
          <div className='flex items-center justify-center'>
            <Loader2 className='h-6 w-6 animate-spin' />
          </div>
        )}
        {todo && (
          <>
            <p className='truncate'>Title: {todo.title}</p>
            <p className='truncate'>Description: {todo.description}</p>
            <p className='truncate'>Due Date: {todo.dueDate.toDateString()}</p>
            <p className='truncate'>
              Completed: {todo.completed ? 'Yes' : 'No'}
            </p>
            <p className='truncate'>
              Created At: {todo.createdAt.toDateString()}
            </p>
            <Textarea
              autoFocus={false}
              placeholder='Add a note'
              value={note || todo.note}
              onChange={(e) => {
                setIsEdited(true);
                setNote(e.target.value);
              }}
            />
            <Button
              onClick={addNote}
              disabled={!isEdited}
              className='mt-8 w-32'
            >
              {isUpdating ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : isEdited ? (
                'Save Note'
              ) : (
                'Edit Note'
              )}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TodoDialog;

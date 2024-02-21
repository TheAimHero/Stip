import React, { useState, type FC, Fragment, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { api } from '@/trpc/react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface TodoDialogProps {
  todoId: number;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}

const TodoDialog: FC<TodoDialogProps> = ({ todoId, isOpen, setIsOpen }) => {
  const { toast } = useToast();
  const {
    data: todo,
    status: todoStatus,
    error: todoError,
  } = api.todo.getOne.useQuery(todoId, {
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    enabled: isOpen,
  });
  useEffect(() => {
    if (todoError) {
      toast({
        variant: 'destructive',
        title: 'Todo Fetch Failed',
        description: 'Something went wrong. Try again...',
      });
    }
  }, [todoError]);
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
  const [note, setNote] = useState<string | undefined>();
  function addNote() {
    isUpdating ? setIsUpdating(false) : setIsUpdating(true);
    updateTodo({ id: todoId, note });
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className={cn(
          'max-h-[90%] max-w-[90%] overflow-scroll sm:max-h-full sm:max-w-[60%] sm:overflow-auto',
          { 'my-auto h-[50%]': todoStatus === 'loading' },
        )}
      >
        <DialogHeader>
          <DialogTitle>Todo Details</DialogTitle>
        </DialogHeader>
        {todoStatus === 'loading' && (
          <div className='flex items-center justify-center'>
            <Loader2 className='h-6 w-6 animate-spin' />
          </div>
        )}
        {todo && (
          <Fragment>
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
              value={note ?? ('' || todo.notes)}
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
          </Fragment>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TodoDialog;

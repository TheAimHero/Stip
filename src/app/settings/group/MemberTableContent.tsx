'use client';

import { format } from 'date-fns';
import { useMediaQuery } from '@uidotdev/usehooks';
import React, {
  type FC,
  useState,
  type Dispatch,
  type SetStateAction,
  useEffect,
} from 'react';
import { ArrowUpDown, ChevronDownIcon } from 'lucide-react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export type GroupMembers = {
  userId: string;
  role: 'USER' | 'MOD' | 'ADMIN';
  joinedAt: Date;
  leftAt: Date | null;
  joined: boolean;
  userName: string | null;
  userEmail: string;
};

function getColumns(
  selected: { userId: string; selected: boolean }[],
  setSelected: Dispatch<
    SetStateAction<{ userId: string; selected: boolean }[]>
  >,
): ColumnDef<GroupMembers>[] {
  const columns: ColumnDef<GroupMembers>[] = [
    {
      id: 'select',
      accessorKey: 'id',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => {
        return (
          <Checkbox
            disabled={row.original.role === 'ADMIN'}
            checked={row.getIsSelected() && row.original.role !== 'ADMIN'}
            onCheckedChange={(value) => {
              setSelected(
                selected.filter((user) => user.userId !== row.original.userId),
              );
              return row.toggleSelected(!!value);
            }}
            aria-label='Select row'
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'userName',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className='w-full'
          >
            Name
            <ArrowUpDown className='h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='text-center capitalize'>{row.getValue('userName')}</div>
      ),
    },
    {
      accessorKey: 'userEmail',
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Email
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full text-center'>{row.getValue('userEmail')}</div>
      ),
    },
    {
      accessorKey: 'joined',
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Joined
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full text-center capitalize'>
          {row.getValue('joined') ? 'Yes' : 'No'}
        </div>
      ),
    },
    {
      accessorKey: 'joinedAt',
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Joined At
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full text-center'>
          {format(row.getValue('joinedAt'), 'dd/MM/yyyy hh:mm')}
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Role
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full text-center capitalize'>
          {row.getValue('role')}
        </div>
      ),
    },
  ];
  return columns;
}

interface DataTableProps {
  data: GroupMembers[];
  rowSelection: Record<string, boolean>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setRowSelection: Dispatch<SetStateAction<{}>>;
}

const MembersTableContent: FC<DataTableProps> = ({
  data,
  rowSelection,
  setRowSelection,
}) => {
  const [selected, setSelected] = useState<
    { userId: string; selected: boolean }[]
  >([]);
  const columns = getColumns(selected, setSelected);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const device = useMediaQuery('(max-width: 768px)');
  useEffect(() => {
    if (device) {
      setColumnVisibility({
        userEmail: false,
        joined: false,
        joinedAt: false,
      });
    }
  }, [device]);
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getRowId: (gm) => gm.userId,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    enableRowSelection(row) {
      if (row.original.role === 'ADMIN') return false;
      return true;
    },
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  return (
    <div className='w-full'>
      <div className='flex items-center gap-5 py-4'>
        <Input
          placeholder='Filter names...'
          value={
            (table.getColumn('userName')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('userName')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns <ChevronDownIcon className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MembersTableContent;

/* eslint-disable @typescript-eslint/ban-types */
'use client';

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
import { useMediaQuery } from '@uidotdev/usehooks';

export type Users = {
  id: string;
  name: string | null;
  email: string;
  role: 'USER' | 'MOD' | 'ADMIN';
  rollNo: number | null;
};

function getColumns(
  prevAttendance: { userId: string; present: boolean }[],
  setPrevAttendance: Dispatch<
    SetStateAction<{ userId: string; present: boolean }[]>
  >,
): ColumnDef<Users>[] {
  const columns: ColumnDef<Users>[] = [
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
            checked={
              row.getIsSelected() ||
              prevAttendance.some(
                (attendance) =>
                  attendance.userId === row.original.id && attendance.present,
              )
            }
            onCheckedChange={(value) => {
              setPrevAttendance(
                prevAttendance.filter(
                  (attendance) => attendance.userId !== row.original.id,
                ),
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
      accessorKey: 'name',
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
        <div className='text-center capitalize'>{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className='w-full'
          >
            Email
            <ArrowUpDown className='h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='text-center'>{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'rollNo',
      header: ({ column }) => {
        return (
          <Button
            className='w-full'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Roll Number
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='w-full text-center capitalize'>
          {row.getValue('rollNo')}
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className='w-full'
          >
            Role
            <ArrowUpDown className='h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='text-center'>{row.getValue('role')}</div>
      ),
    },
  ];
  return columns;
}

interface DataTableProps {
  data: Users[];
  rowSelection: {};
  setRowSelection: Dispatch<SetStateAction<{} | undefined>>;
  prevAttendance: { userId: string; present: boolean }[];
}

const DataTable: FC<DataTableProps> = ({
  data,
  rowSelection,
  setRowSelection,
  prevAttendance,
}) => {
  const device = useMediaQuery('(max-width: 768px)');
  const [localPrevAttendance, setLocalPrevAttendance] =
    useState(prevAttendance);
  const columns = getColumns(localPrevAttendance, setLocalPrevAttendance);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  useEffect(() => {
    if (device) {
      setColumnVisibility({ email: false, role: false });
    }
  }, [device]);
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getRowId: (user) => user.id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
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
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
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

export default DataTable;
